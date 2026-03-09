import dynamic from 'next/dynamic';

const PlansPage = dynamic(() => import('@/views/admin/plans-page'));

export default function Page() {
  return <PlansPage />;
}
