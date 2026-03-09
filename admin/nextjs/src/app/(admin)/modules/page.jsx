import dynamic from 'next/dynamic';

const ModulesCatalogPage = dynamic(() => import('@/views/admin/modules-catalog'));

export default function Page() {
  return <ModulesCatalogPage />;
}
