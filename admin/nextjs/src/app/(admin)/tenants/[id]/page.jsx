// @next
import dynamic from 'next/dynamic';

// @project
const TenantDetailPage = dynamic(() => import('@/views/admin/tenant-detail'));

/***************************  TENANT DETAIL PAGE  ***************************/

export default function TenantDetail() {
  return <TenantDetailPage />;
}
