import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  sidebarWidth: number;
  isNavbarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleNavbar: () => void;
  setSidebarWidth: (width: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  sidebarWidth: 256,
  isNavbarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleNavbar: () => set((state) => ({ isNavbarCollapsed: !state.isNavbarCollapsed })),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
}));