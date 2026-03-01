// prisma/seed.ts — Seeds default Plans, Modules, system Roles & demo Tenant
// Run: pnpm db:seed
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

// ── PLANS ────────────────────────────────────────────────
const plans = [
  {
    name: 'Starter',
    code: 'starter',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    limits: { users: 1, products: 50, transactions: 100, warehouses: 1 },
    features: { pos: true, basic_reports: true, website: false, api: false },
  },
  {
    name: 'Business',
    code: 'business',
    priceMonthly: 79,
    priceYearly: 790,
    trialDays: 14,
    limits: { users: 5, products: 500, transactions: 1000, warehouses: 2 },
    features: { pos: true, basic_reports: true, advanced_reports: true, website: true, api: false },
  },
  {
    name: 'Professional',
    code: 'professional',
    priceMonthly: 199,
    priceYearly: 1990,
    trialDays: 14,
    limits: { users: 15, products: 2000, transactions: 5000, warehouses: 5 },
    features: { pos: true, basic_reports: true, advanced_reports: true, website: true, api: true, multi_warehouse: true },
  },
  {
    name: 'Entreprise',
    code: 'enterprise',
    priceMonthly: 499,
    priceYearly: 4990,
    trialDays: 30,
    limits: { users: -1, products: -1, transactions: -1, warehouses: -1 },
    features: { pos: true, basic_reports: true, advanced_reports: true, website: true, api: true, multi_warehouse: true, custom_domain: true, priority_support: true },
  },
];

// ── MODULES ──────────────────────────────────────────────
const modules = [
  { name: 'Tableau de Bord', code: 'dashboard', category: 'core', icon: 'IconDashboard', isCore: true, priceMonthly: 0, description: 'Vue d\'ensemble de votre activité' },
  { name: 'Produits & Catalogue', code: 'products', category: 'core', icon: 'IconPackage', isCore: true, priceMonthly: 0, description: 'Gestion des produits, catégories, marques' },
  { name: 'Ventes & Facturation', code: 'sales', category: 'sales', icon: 'IconReceipt', isCore: true, priceMonthly: 0, description: 'Devis, factures, bons de livraison, avoirs' },
  { name: 'Clients', code: 'customers', category: 'sales', icon: 'IconUsers', isCore: true, priceMonthly: 0, description: 'Gestion clients, groupes, fidélité' },
  { name: 'Stock & Inventaire', code: 'inventory', category: 'inventory', icon: 'IconBuildingWarehouse', isCore: true, priceMonthly: 0, description: 'Suivi de stock, mouvements, alertes' },
  { name: 'Point de Vente (POS)', code: 'pos', category: 'sales', icon: 'IconDeviceDesktop', isCore: false, priceMonthly: 29, description: 'Caisse enregistreuse, sessions, tickets' },
  { name: 'Achats & Fournisseurs', code: 'purchases', category: 'purchasing', icon: 'IconTruck', isCore: false, priceMonthly: 0, description: 'Bons de commande, réception, fournisseurs' },
  { name: 'Comptabilité', code: 'accounting', category: 'finance', icon: 'IconCalculator', isCore: false, priceMonthly: 39, description: 'Plan comptable, journal, grand livre, bilan' },
  { name: 'Trésorerie & Banques', code: 'treasury', category: 'finance', icon: 'IconBuildingBank', isCore: false, priceMonthly: 19, description: 'Comptes bancaires, rapprochement, virements' },
  { name: 'Rapports & Analytics', code: 'reports', category: 'analytics', icon: 'IconChartBar', isCore: false, priceMonthly: 0, description: 'Tableaux de bord avancés, export PDF/Excel' },
  { name: 'Site Web & E-Commerce', code: 'website', category: 'website', icon: 'IconWorld', isCore: false, priceMonthly: 49, description: 'Constructeur de site, boutique en ligne' },
  { name: 'CRM', code: 'crm', category: 'sales', icon: 'IconHeart', isCore: false, priceMonthly: 29, description: 'Pipeline commercial, leads, opportunités' },
  { name: 'Ressources Humaines', code: 'hr', category: 'hr', icon: 'IconUserCheck', isCore: false, priceMonthly: 39, description: 'Employés, paie, congés, présence' },
  { name: 'Multi-Entrepôt', code: 'multi_warehouse', category: 'inventory', icon: 'IconBuildingWarehouse', isCore: false, priceMonthly: 19, description: 'Gestion multi-sites, transferts inter-entrepôts' },
  { name: 'Fidélité & Coupons', code: 'loyalty', category: 'marketing', icon: 'IconGift', isCore: false, priceMonthly: 19, description: 'Points de fidélité, coupons, promotions' },
  { name: 'Automatisation', code: 'automation', category: 'advanced', icon: 'IconRobot', isCore: false, priceMonthly: 29, description: 'Workflows, notifications automatiques, rappels' },
];

// ── DEFAULT ROLES ────────────────────────────────────────
const defaultRoles = [
  { name: 'Administrateur', code: 'tenant_admin', level: 90, isSystem: true, permissions: ['*'] },
  { name: 'Gérant', code: 'manager', level: 70, isSystem: true, permissions: ['dashboard.*', 'products.*', 'sales.*', 'inventory.*', 'customers.*', 'reports.read'] },
  { name: 'Comptable', code: 'accountant', level: 50, isSystem: true, permissions: ['dashboard.read', 'sales.*', 'payments.*', 'reports.*', 'accounting.*'] },
  { name: 'Commercial', code: 'sales_rep', level: 40, isSystem: true, permissions: ['dashboard.read', 'products.read', 'sales.*', 'customers.*'] },
  { name: 'Caissier', code: 'cashier', level: 30, isSystem: true, permissions: ['pos.*', 'products.read', 'customers.read'] },
  { name: 'Magasinier', code: 'inventory_clerk', level: 30, isSystem: true, permissions: ['inventory.*', 'products.read'] },
  { name: 'Consultant', code: 'viewer', level: 10, isSystem: true, permissions: ['dashboard.read', 'reports.read'] },
];

// ── SEED RUNNER ──────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding TuniERP database …\n');

  // 1. Plans
  for (const p of plans) {
    await prisma.plan.upsert({
      where: { code: p.code },
      update: { ...p },
      create: { ...p },
    });
  }
  console.log(`  ✅  ${plans.length} plans`);

  // 2. Modules
  for (const m of modules) {
    await prisma.module.upsert({
      where: { code: m.code },
      update: { ...m, dependencies: [], settingsSchema: null },
      create: { ...m, dependencies: [], settingsSchema: null },
    });
  }
  console.log(`  ✅  ${modules.length} modules`);

  // 3. Link core modules to all plans
  const allPlans = await prisma.plan.findMany();
  const coreModules = await prisma.module.findMany({ where: { isCore: true } });

  for (const plan of allPlans) {
    for (const mod of coreModules) {
      await prisma.planModule.upsert({
        where: { planId_moduleId: { planId: plan.id, moduleId: mod.id } },
        update: {},
        create: { planId: plan.id, moduleId: mod.id, isIncluded: true },
      });
    }
  }
  console.log(`  ✅  Core modules linked to all plans`);

  // 4. Link paid modules to Business+ plans
  const paidModules = await prisma.module.findMany({ where: { isCore: false } });
  const businessPlus = allPlans.filter((p) => ['business', 'professional', 'enterprise'].includes(p.code));

  for (const plan of businessPlus) {
    for (const mod of paidModules) {
      await prisma.planModule.upsert({
        where: { planId_moduleId: { planId: plan.id, moduleId: mod.id } },
        update: {},
        create: { planId: plan.id, moduleId: mod.id, isIncluded: true },
      });
    }
  }
  console.log(`  ✅  Paid modules linked to Business+ plans`);

  // 5. Create demo tenant
  const starterPlan = allPlans.find((p) => p.code === 'starter')!;
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Entreprise Démo',
      slug: 'demo',
      schemaName: 'tenant_demo',
      businessType: 'general',
      planId: starterPlan.id,
      status: 'active',
      settings: { language: 'fr', dateFormat: 'DD/MM/YYYY', numberFormat: '1.000,000' },
    },
  });
  console.log(`  ✅  Demo tenant: ${demoTenant.id}`);

  // 6. Activate core modules for demo tenant
  for (const mod of coreModules) {
    await prisma.tenantModule.upsert({
      where: { tenantId_moduleId: { tenantId: demoTenant.id, moduleId: mod.id } },
      update: {},
      create: { tenantId: demoTenant.id, moduleId: mod.id, isActive: true },
    });
  }
  console.log(`  ✅  Core modules activated for demo tenant`);

  // 7. Create default roles for demo tenant
  for (const r of defaultRoles) {
    await prisma.role.upsert({
      where: { tenantId_code: { tenantId: demoTenant.id, code: r.code } },
      update: {},
      create: { tenantId: demoTenant.id, ...r },
    });
  }
  console.log(`  ✅  ${defaultRoles.length} default roles for demo tenant`);

  // 8. Create demo admin user (password: "demo1234")
  // bcrypt hash of "demo1234"
  const demoPasswordHash = '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36r6Q7EwqZ5YqFHU36VKOGy';
  const adminRole = await prisma.role.findUnique({
    where: { tenantId_code: { tenantId: demoTenant.id, code: 'tenant_admin' } },
  });

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: demoTenant.id, email: 'admin@demo.tunierp.tn' } },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: 'admin@demo.tunierp.tn',
      passwordHash: demoPasswordHash,
      firstName: 'Admin',
      lastName: 'Démo',
      roleId: adminRole?.id,
      isActive: true,
    },
  });
  console.log(`  ✅  Demo admin user: admin@demo.tunierp.tn`);

  // 9. Create default warehouse for demo tenant
  await prisma.warehouse.upsert({
    where: { tenantId_code: { tenantId: demoTenant.id, code: 'MAIN' } },
    update: {},
    create: {
      tenantId: demoTenant.id,
      name: 'Entrepôt Principal',
      code: 'MAIN',
      address: 'Tunis, Tunisie',
      isDefault: true,
    },
  });
  console.log(`  ✅  Default warehouse for demo tenant`);

  // 10. Create document sequences for demo tenant
  const docTypes = [
    { docType: 'DEV' as const, prefix: 'DEV' },
    { docType: 'FAC' as const, prefix: 'FAC' },
    { docType: 'BL' as const, prefix: 'BL' },
    { docType: 'BC' as const, prefix: 'BC' },
    { docType: 'REC' as const, prefix: 'REC' },
    { docType: 'PRO' as const, prefix: 'PRO' },
    { docType: 'AVF' as const, prefix: 'AVF' },
    { docType: 'GAR' as const, prefix: 'GAR' },
    { docType: 'DP' as const, prefix: 'DP' },
  ];

  for (const dt of docTypes) {
    await prisma.documentSequence.upsert({
      where: { tenantId_docType_year: { tenantId: demoTenant.id, docType: dt.docType, year: 2026 } },
      update: {},
      create: { tenantId: demoTenant.id, ...dt, year: 2026, lastNumber: 0, format: '{prefix}-{year}-{number:5}' },
    });
  }
  console.log(`  ✅  ${docTypes.length} document sequences for 2026`);

  console.log('\n🎉  Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌  Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
