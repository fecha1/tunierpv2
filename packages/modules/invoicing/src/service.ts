import { prisma, withTenantScope } from '@tunierp/database';
import type { DocumentCode, SaleType, SaleStatus, PaymentMethod } from '@tunierp/database';

// ── Document Number Generator ─────────────────────────────

async function generateDocNumber(tenantId: string, docType: DocumentCode): Promise<string> {
  const year = new Date().getFullYear();

  const seq = await prisma.documentSequence.findFirst({
    where: { tenantId, docType, year },
  });

  if (!seq) {
    throw new Error(`Séquence de document manquante pour ${docType}-${year}`);
  }

  const nextNumber = seq.lastNumber + 1;

  await prisma.documentSequence.update({
    where: { id: seq.id },
    data: { lastNumber: nextNumber },
  });

  // Format: DEV-2026-00001
  const paddedNumber = String(nextNumber).padStart(5, '0');
  return `${seq.prefix}-${year}-${paddedNumber}`;
}

// ── Sales Service ─────────────────────────────────────────

/**
 * List sales documents (quotes, invoices, delivery notes, etc.)
 */
export async function listSales(
  tenantId: string,
  filters?: { type?: string; status?: string; customerId?: string; search?: string; limit?: number; offset?: number },
) {
  const scoped = withTenantScope(prisma, tenantId);

  const where: any = {};
  if (filters?.type) where.saleType = filters.type;
  if (filters?.status) where.status = filters.status;
  if (filters?.customerId) where.customerId = filters.customerId;

  const [data, total] = await Promise.all([
    scoped.sale.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, companyName: true, email: true } },
        items: { select: { id: true, productId: true, quantity: true, unitPrice: true, total: true, product: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 25,
      skip: filters?.offset || 0,
    }),
    scoped.sale.count({ where }),
  ]);

  return { data, total, limit: filters?.limit || 25, offset: filters?.offset || 0 };
}

/**
 * Get single sale by ID
 */
export async function getSaleById(tenantId: string, saleId: string) {
  const sale = await prisma.sale.findFirst({
    where: { id: saleId, tenantId },
    include: {
      customer: true,
      items: {
        include: { product: { select: { name: true, sku: true } }, variant: { select: { name: true, sku: true } } },
      },
    },
  });

  if (!sale) throw new Error('Document introuvable');
  return sale;
}

/**
 * Create a sale document (quote, invoice, delivery note, etc.)
 */
export async function createSale(
  tenantId: string,
  data: {
    type: 'quote' | 'invoice' | 'delivery_note' | 'proforma' | 'credit_note' | 'warranty';
    customerId?: string;
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      unitPrice: number;
      discount?: number;
      taxRate?: number;
    }>;
    notes?: string;
    userId: string;
  },
) {
  // Map type to SaleType enum and document code
  const typeToSaleType: Record<string, string> = {
    quote: 'quote',
    invoice: 'invoice',
    delivery_note: 'delivery',
    proforma: 'proforma',
    credit_note: 'credit_note',
    warranty: 'warranty',
  };

  const typeToCode: Record<string, string> = {
    quote: 'DEV',
    invoice: 'FAC',
    delivery_note: 'BL',
    proforma: 'PRO',
    credit_note: 'AVF',
    warranty: 'GAR',
  };

  const saleType = typeToSaleType[data.type] || 'invoice';
  const docCode = typeToCode[data.type] || 'FAC';
  const docNumber = await generateDocNumber(tenantId, docCode as DocumentCode);

  // Calculate totals
  let subtotal = 0;
  let totalTax = 0;
  const saleItems = data.items.map((item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const discountAmount = lineTotal * ((item.discount || 0) / 100);
    const taxableAmount = lineTotal - discountAmount;
    const tax = taxableAmount * ((item.taxRate || 19) / 100);
    subtotal += taxableAmount;
    totalTax += tax;

    return {
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountPercent: item.discount || 0,
      discountAmount: Math.round(discountAmount * 1000) / 1000,
      taxRate: item.taxRate || 19,
      taxAmount: Math.round(tax * 1000) / 1000,
      total: Math.round((taxableAmount + tax) * 1000) / 1000,
    };
  });

  const timbreFiscal = 1; // 1 TND droit de timbre
  const grandTotal = Math.round((subtotal + totalTax + timbreFiscal) * 1000) / 1000;

  const sale = await prisma.sale.create({
    data: {
      tenantId,
      saleType: saleType as SaleType,
      saleNumber: docNumber,
      saleDate: new Date(),
      customerId: data.customerId,
      status: 'draft',
      subtotal,
      taxAmount: totalTax,
      timbreFiscal,
      total: grandTotal,
      notes: data.notes,
      createdBy: data.userId,
      items: {
        create: saleItems.map((item) => ({ tenantId, ...item })),
      },
    },
    include: { items: true, customer: true },
  });

  return sale;
}

/**
 * Update sale status (draft → confirmed → delivered → paid / cancelled)
 */
export async function updateSaleStatus(
  tenantId: string,
  saleId: string,
  status: string,
) {
  const sale = await prisma.sale.findFirst({ where: { id: saleId, tenantId } });
  if (!sale) throw new Error('Document introuvable');

  return prisma.sale.update({
    where: { id: saleId },
    data: { status: status as any },
  });
}

/**
 * Convert quote to invoice
 */
export async function convertQuoteToInvoice(tenantId: string, quoteId: string, userId: string) {
  const quote = await prisma.sale.findFirst({
    where: { id: quoteId, tenantId, saleType: 'quote' },
    include: { items: true },
  }) as any;

  if (!quote) throw new Error('Devis introuvable');

  const invoiceNumber = await generateDocNumber(tenantId, 'FAC' as DocumentCode);

  const invoice = await prisma.sale.create({
    data: {
      tenantId,
      saleType: 'invoice',
      saleNumber: invoiceNumber,
      saleDate: new Date(),
      customerId: quote.customerId,
      status: 'confirmed',
      subtotal: quote.subtotal,
      taxAmount: quote.taxAmount,
      timbreFiscal: quote.timbreFiscal,
      total: quote.total,
      convertedFrom: quoteId,
      notes: `Converti du devis ${quote.saleNumber}`,
      createdBy: userId,
      items: {
        create: quote.items.map((item: any) => ({
          tenantId,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountPercent: item.discountPercent,
          discountAmount: item.discountAmount,
          taxRate: item.taxRate,
          taxAmount: item.taxAmount,
          total: item.total,
        })),
      },
    },
    include: { items: true, customer: true },
  });

  // Mark quote as converted
  await prisma.sale.update({
    where: { id: quoteId },
    data: { status: 'converted' as any },
  });

  return invoice;
}

// ── Payments Service ───────────────────────────────────────

export async function listPayments(
  tenantId: string,
  filters?: { saleId?: string; method?: string; limit?: number },
) {
  const scoped = withTenantScope(prisma, tenantId);

  const where: any = {};
  if (filters?.saleId) where.saleId = filters.saleId;
  if (filters?.method) where.paymentMethod = filters.method;

  return scoped.payment.findMany({
    where,
    include: {
      sale: { select: { saleNumber: true, saleType: true, total: true } },
      customer: { select: { firstName: true, lastName: true, companyName: true } },
    },
    orderBy: { paymentDate: 'desc' },
    take: filters?.limit || 25,
  });
}

export async function createPayment(
  tenantId: string,
  data: {
    saleId: string;
    customerId?: string;
    amount: number;
    method: string;
    reference?: string;
    notes?: string;
  },
) {
  const paymentNumber = `PAY-${Date.now()}`;

  const payment = await prisma.payment.create({
    data: {
      tenantId,
      saleId: data.saleId,
      customerId: data.customerId,
      amount: data.amount,
      paymentNumber,
      paymentType: 'received',
      paymentMethod: data.method as PaymentMethod,
      paymentReference: data.reference,
      paymentDate: new Date(),
      notes: data.notes,
      status: 'completed',
    },
  });

  // Check if sale is fully paid
  const sale = await prisma.sale.findUnique({ where: { id: data.saleId } });
  if (sale) {
    const totalPaid = await prisma.payment.aggregate({
      where: { saleId: data.saleId, status: 'completed' },
      _sum: { amount: true },
    });

    const paidAmount = Number(totalPaid._sum?.amount ?? 0);
    const saleTotal = Number(sale.total);

    if (paidAmount >= saleTotal) {
      await prisma.sale.update({
        where: { id: data.saleId },
        data: { status: 'paid', amountPaid: paidAmount },
      });
    } else {
      await prisma.sale.update({
        where: { id: data.saleId },
        data: { status: 'partial' as SaleStatus, amountPaid: paidAmount },
      });
    }
  }

  return payment;
}

// ── Dashboard Stats ────────────────────────────────────────

export async function getInvoicingStats(tenantId: string) {
  const scoped = withTenantScope(prisma, tenantId);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    monthlyRevenue,
    unpaidInvoices,
    totalQuotes,
    totalInvoices,
  ] = await Promise.all([
    scoped.sale.aggregate({
      where: { saleType: 'invoice', status: 'paid', createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }) as any,
    scoped.sale.aggregate({
      where: { saleType: 'invoice', status: { in: ['confirmed', 'delivered'] } },
      _sum: { total: true },
      _count: true,
    }) as any,
    scoped.sale.count({ where: { saleType: 'quote', createdAt: { gte: startOfMonth } } }),
    scoped.sale.count({ where: { saleType: 'invoice', createdAt: { gte: startOfMonth } } }),
  ]);

  return {
    monthlyRevenue: Number(monthlyRevenue._sum?.total ?? 0),
    unpaidAmount: Number(unpaidInvoices._sum?.total ?? 0),
    unpaidCount: unpaidInvoices._count || 0,
    monthlyQuotes: totalQuotes,
    monthlyInvoices: totalInvoices,
  };
}
