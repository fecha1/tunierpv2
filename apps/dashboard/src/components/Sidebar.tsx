'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSidebarStore } from '@/stores/sidebar';
import { useAuthStore } from '@/stores/auth';
import {
  IconLayoutDashboard,
  IconPackages,
  IconFileInvoice,
  IconShoppingCart,
  IconDeviceDesktop,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';

// Map icon strings from the API to actual components
const ICON_MAP: Record<string, any> = {
  IconLayoutDashboard,
  IconPackages,
  IconPackage: IconPackages,
  IconFileInvoice,
  IconShoppingCart,
  IconDeviceDesktop,
  IconChartBar: IconLayoutDashboard,
  IconChartLine: IconLayoutDashboard,
  IconChartDonut: IconLayoutDashboard,
  IconArrowsExchange: IconPackages,
  IconBuildingWarehouse: IconPackages,
  IconFileDescription: IconFileInvoice,
  IconTruckDelivery: IconShoppingCart,
  IconCash: IconFileInvoice,
  IconUsers: IconLayoutDashboard,
  IconFileText: IconFileInvoice,
  IconPackageImport: IconPackages,
  IconTruck: IconShoppingCart,
  IconClipboardList: IconDeviceDesktop,
  IconReceipt: IconFileInvoice,
};

function getIcon(iconName: string, size = 20) {
  const Icon = ICON_MAP[iconName] || IconLayoutDashboard;
  return <Icon size={size} stroke={1.5} />;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { groups, collapsed, toggleCollapse, isLoading } = useSidebarStore();
  const { tenant, logout } = useAuthStore();

  const width = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width,
        background: '#fff',
        borderRight: '1px solid #e8ecf1',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Logo area */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 16px' : '0 24px',
          borderBottom: '1px solid #e8ecf1',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #101c37, #264b8d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          T
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#101c37', whiteSpace: 'nowrap' }}>
              Tuni<span style={{ color: '#264b8d' }}>ERP</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#888',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 160,
              }}
            >
              {tenant?.name || 'Entreprise'}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {/* Dashboard link (always visible) */}
        <NavItem
          icon={<IconLayoutDashboard size={20} stroke={1.5} />}
          label="Tableau de bord"
          href="/dashboard"
          active={pathname === '/dashboard'}
          collapsed={collapsed}
        />

        {/* Dynamic module groups */}
        {groups.map((group) => (
          <div key={group.category} style={{ marginTop: 16 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  padding: '0 12px',
                  marginBottom: 6,
                }}
              >
                {group.label}
              </div>
            )}
            {group.items.map((item: any) => (
              <NavItem
                key={item.id}
                icon={getIcon(item.icon)}
                label={item.title}
                href={item.url}
                active={pathname === item.url || pathname.startsWith(item.url + '/')}
                collapsed={collapsed}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '8px', borderTop: '1px solid #e8ecf1', flexShrink: 0 }}>
        <NavItem
          icon={<IconSettings size={20} stroke={1.5} />}
          label="Paramètres"
          href="/dashboard/settings"
          active={pathname.startsWith('/dashboard/settings')}
          collapsed={collapsed}
        />
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: collapsed ? '10px 16px' : '10px 12px',
            border: 'none',
            background: 'transparent',
            borderRadius: 8,
            cursor: 'pointer',
            color: '#e53935',
            fontSize: 13,
            fontWeight: 500,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fff0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <IconLogout size={20} stroke={1.5} />
          {!collapsed && 'Déconnexion'}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '8px',
            border: 'none',
            background: 'transparent',
            borderRadius: 8,
            cursor: 'pointer',
            color: '#888',
            marginTop: 4,
          }}
        >
          {collapsed ? <IconChevronsRight size={18} /> : <IconChevronsLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  href,
  active,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: collapsed ? '10px 16px' : '10px 12px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? '#264b8d' : '#555',
        background: active ? '#eef2ff' : 'transparent',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        marginBottom: 2,
      }}
    >
      <span style={{ flexShrink: 0, color: active ? '#264b8d' : '#888' }}>{icon}</span>
      {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
    </Link>
  );
}
