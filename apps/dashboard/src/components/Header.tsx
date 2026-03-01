'use client';

import { useAuthStore } from '@/stores/auth';
import { useSidebarStore } from '@/stores/sidebar';
import { IconBell, IconSearch } from '@tabler/icons-react';

export default function Header() {
  const { user, tenant } = useAuthStore();
  const { collapsed } = useSidebarStore();

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarWidth,
        right: 0,
        height: 'var(--header-height)',
        background: '#fff',
        borderBottom: '1px solid #e8ecf1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        transition: 'left 0.3s ease',
        zIndex: 999,
      }}
    >
      {/* Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#f5f7fa',
          borderRadius: 10,
          padding: '8px 14px',
          flex: '0 1 360px',
        }}
      >
        <IconSearch size={16} stroke={1.5} color="#999" />
        <input
          type="text"
          placeholder="Rechercher..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 13,
            width: '100%',
            color: '#333',
          }}
        />
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 8,
            color: '#555',
          }}
        >
          <IconBell size={20} stroke={1.5} />
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#e53935',
            }}
          />
        </button>

        {/* User info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: 10,
            transition: 'background 0.15s',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #101c37, #264b8d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>
              {user?.role?.name || 'Utilisateur'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
