// prisma/seed.ts — Seeds default Plans, Modules & system Roles
// Run: npx tsx prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.ts';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

// ── PLANS (from doc 05) ──────────────────────────────────
const plans = [
  {
    name: 'Starter',
    code: 'starter',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    limits: { users: 1, products: 50, transactions: 100, warehouses: 1 },
    features: { pos: true, basic_reports: true, website: false, api: false }
  },
  {
    name: 'Business',
    code: 'business',
    priceMonthly: 79,
    priceYearly: 790,
    trialDays: 14,
    limits: { users: 5, products: 500, transactions: 1000, warehouses: 2 },
    features: { pos: true, basic_reports: true, advanced_reports: true, website: true, api: false }
  },
  {
    name: 'Professional',
    code: 'professional',
    priceMonthly: 199,
    priceYearly: 1990,
    trialDays: 14,
    limits: { users: 15, products: 2000, transactions: 5000, warehouses: 5 },
    features: { pos: true, basic_reports: true, advanced_reports: true, website: true, api: true, multi_warehouse: true }
  },
  {
    name: 'Entreprise',
    code: 'enterprise',
    priceMonthly: 499,
    priceYearly: 4990,
    trialDays: 30,
    limits: { users: -1, products: -1, transactions: -1, warehouses: -1 },
    features: { pos: true, basic_reports: true, advanced_reports: true, website: true, api: true, multi_warehouse: true, custom_domain: true, priority_support: true }
  }
];

// ── MODULES (from doc 03) ────────────────────────────────
const modules = [
  { name: 'Tableau de Bord', code: 'dashboard', category: 'core', icon: 'IconDashboard', isCore: true, priceMonthly: 0 },
  { name: 'Produits & Catalogue', code: 'products', category: 'core', icon: 'IconPackage', isCore: true, priceMonthly: 0 },
  { name: 'Ventes & Facturation', code: 'sales', category: 'sales', icon: 'IconReceipt', isCore: true, priceMonthly: 0 },
  { name: 'Clients', code: 'customers', category: 'sales', icon: 'IconUsers', isCore: true, priceMonthly: 0 },
  { name: 'Stock & Inventaire', code: 'inventory', category: 'inventory', icon: 'IconBuildingWarehouse', isCore: true, priceMonthly: 0 },
  { name: 'Point de Vente (POS)', code: 'pos', category: 'sales', icon: 'IconDeviceDesktop', isCore: false, priceMonthly: 29 },
  { name: 'Achats & Fournisseurs', code: 'purchases', category: 'purchasing', icon: 'IconTruck', isCore: false, priceMonthly: 0 },
  { name: 'Comptabilité', code: 'accounting', category: 'finance', icon: 'IconCalculator', isCore: false, priceMonthly: 39 },
  { name: 'Trésorerie & Banques', code: 'treasury', category: 'finance', icon: 'IconBuildingBank', isCore: false, priceMonthly: 19 },
  { name: 'Rapports & Analytics', code: 'reports', category: 'analytics', icon: 'IconChartBar', isCore: false, priceMonthly: 0 },
  { name: 'Site Web & E-Commerce', code: 'website', category: 'website', icon: 'IconWorld', isCore: false, priceMonthly: 49 },
  { name: 'CRM', code: 'crm', category: 'sales', icon: 'IconHeart', isCore: false, priceMonthly: 29 },
  { name: 'Ressources Humaines', code: 'hr', category: 'hr', icon: 'IconUserCheck', isCore: false, priceMonthly: 39 },
  { name: 'Multi-Entrepôt', code: 'multi_warehouse', category: 'inventory', icon: 'IconBuildingWarehouse', isCore: false, priceMonthly: 19 },
  { name: 'Fidélité & Coupons', code: 'loyalty', category: 'marketing', icon: 'IconGift', isCore: false, priceMonthly: 19 },
  { name: 'Automatisation', code: 'automation', category: 'advanced', icon: 'IconRobot', isCore: false, priceMonthly: 29 }
];

// ── SEED RUNNER ──────────────────────────────────────────
async function main() {
  console.log('🌱  Seeding TuniERP database …');

  // Plans
  for (const p of plans) {
    await prisma.plan.upsert({
      where: { code: p.code },
      update: { ...p },
      create: { ...p }
    });
  }
  console.log(`✅  ${plans.length} plans`);

  // Modules
  for (const m of modules) {
    await prisma.module.upsert({
      where: { code: m.code },
      update: { ...m },
      create: { ...m, dependencies: [], settingsSchema: null }
    });
  }
  console.log(`✅  ${modules.length} modules`);

  // Link core modules to all plans
  const allPlans = await prisma.plan.findMany();
  const coreModules = await prisma.module.findMany({ where: { isCore: true } });

  for (const plan of allPlans) {
    for (const mod of coreModules) {
      await prisma.planModule.upsert({
        where: { planId_moduleId: { planId: plan.id, moduleId: mod.id } },
        update: {},
        create: { planId: plan.id, moduleId: mod.id, isIncluded: true }
      });
    }
  }
  console.log(`✅  Core modules linked to all plans`);

  console.log('🎉  Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌  Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
