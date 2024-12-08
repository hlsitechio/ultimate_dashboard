import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  dashboardTitle: string;
  dashboardTitleColor: string;
  setDashboardTitle: (title: string) => void;
  setDashboardTitleColor: (color: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      dashboardTitle: 'Dashboard Overview',
      dashboardTitleColor: 'text-white',
      setDashboardTitle: (title) => set({ dashboardTitle: title }),
      setDashboardTitleColor: (color) => set({ dashboardTitleColor: color }),
    }),
    {
      name: 'settings-storage',
    }
  )
);