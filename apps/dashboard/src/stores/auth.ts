'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: { code: string; name: string; level: number } | null;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  logoUrl?: string;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    Cookies.set('tunierp_access_token', data.accessToken, { expires: 1 });
    Cookies.set('tunierp_refresh_token', data.refreshToken, { expires: 7 });

    set({
      user: data.user,
      tenant: data.tenant,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    Cookies.remove('tunierp_access_token');
    Cookies.remove('tunierp_refresh_token');
    set({ user: null, tenant: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/login';
  },

  loadSession: async () => {
    const token = Cookies.get('tunierp_access_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data } = await api.post('/auth/me');
      set({
        user: {
          id: data.userId,
          email: data.email,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          role: data.role || null,
        },
        tenant: data.tenant || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      Cookies.remove('tunierp_access_token');
      set({ isLoading: false });
    }
  },
}));
