'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useSidebarStore } from '@/stores/sidebar';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, loadSession } = useAuthStore();
  const { loadSidebar, collapsed } = useSidebarStore();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
    if (isAuthenticated) {
      loadSidebar();
    }
  }, [isAuthenticated, isLoading, router, loadSidebar]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#666' }}>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: sidebarWidth, transition: 'margin-left 0.3s ease' }}>
        <Header />
        <main style={{ padding: '24px', marginTop: 'var(--header-height)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
