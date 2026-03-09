// @next
import dynamic from 'next/dynamic';

// @project
const TenantsPage = dynamic(() => import('@/views/admin/tenants'));

/***************************  TENANTS PAGE  ***************************/

export default function Tenants() {
  return <TenantsPage />;
}
