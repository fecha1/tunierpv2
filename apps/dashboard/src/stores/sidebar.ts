'use client';

import { create } from 'zustand';
import api from '@/lib/api';

interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  url: string;
  children?: SidebarItem[];
  badge?: string;
}

interface SidebarGroup {
  category: string;
  label: string;
  items: SidebarItem[];
}

interface SidebarState {
  groups: SidebarGroup[];
  collapsed: boolean;
  isLoading: boolean;

  loadSidebar: () => Promise<void>;
  toggleCollapse: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  groups: [],
  collapsed: false,
  isLoading: true,

  loadSidebar: async () => {
    try {
      const { data } = await api.get('/modules/sidebar');
      set({ groups: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleCollapse: () => set((state) => ({ collapsed: !state.collapsed })),
}));
