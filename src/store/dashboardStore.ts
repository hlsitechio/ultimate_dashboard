import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Layout } from 'react-grid-layout';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  color: string;
  notification?: number;
  enabled: boolean;
  order: number;
}

interface DashboardState {
  layout: Layout[];
  quickActions: QuickAction[];
  updateLayout: (newLayout: Layout[]) => void;
  resetLayout: () => void;
  updateQuickActions: (actions: QuickAction[]) => void;
  toggleQuickAction: (id: string) => void;
  reorderQuickActions: (fromIndex: number, toIndex: number) => void;
}

const defaultLayout: Layout[] = [
  { i: 'actions', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 }
];

const defaultQuickActions: QuickAction[] = [
  {
    id: 'calendar',
    icon: 'CalendarPlus',
    label: 'New Event',
    color: 'primary',
    enabled: true,
    order: 0
  },
  {
    id: 'email',
    icon: 'Mail',
    label: 'Send Email',
    color: 'green',
    notification: 5,
    enabled: true,
    order: 1
  }
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      layout: defaultLayout,
      quickActions: defaultQuickActions,
      updateLayout: (newLayout) => set({ layout: newLayout }),
      resetLayout: () => set({ layout: defaultLayout }),
      updateQuickActions: (actions) => set({ quickActions: actions }),
      toggleQuickAction: (id) => set((state) => ({
        quickActions: state.quickActions.map(action =>
          action.id === id ? { ...action, enabled: !action.enabled } : action
        )
      })),
      reorderQuickActions: (fromIndex, toIndex) => set((state) => {
        const newActions = [...state.quickActions];
        const [movedAction] = newActions.splice(fromIndex, 1);
        newActions.splice(toIndex, 0, movedAction);
        return { quickActions: newActions.map((action, index) => ({
          ...action,
          order: index
        })) };
      })
    }),
    {
      name: 'dashboard-storage'
    }
  )
);