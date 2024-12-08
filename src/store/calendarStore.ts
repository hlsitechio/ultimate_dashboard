import { create } from 'zustand';
import { addEvent, listEvents } from '../lib/googleApi';
import { initGoogleAuth } from '../lib/googleAuth';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
}

interface CalendarState {
  events: Event[];
  selectedDate: Date;
  view: 'month' | 'week' | 'day';
  loading: boolean;
  error: string | null;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  fetchEvents: () => Promise<void>;
  setSelectedDate: (date: Date) => void;
  setView: (view: 'month' | 'week' | 'day') => void;
  clearError: () => void;
  connectCalendar: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  selectedDate: new Date(),
  view: 'week',
  loading: false,
  error: null,

  connectCalendar: async () => {
    try {
      set({ loading: true, error: null });
      const scopes = ['https://www.googleapis.com/auth/calendar'];
      await initGoogleAuth(scopes);
      await get().fetchEvents();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      const events = await listEvents();
      set({ 
        events: events.map(event => ({
          id: event.id!,
          title: event.summary!,
          description: event.description,
          start: new Date(event.start?.dateTime || event.start?.date!),
          end: new Date(event.end?.dateTime || event.end?.date!),
          color: 'bg-primary'
        })),
        loading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addEvent: async (event) => {
    try {
      set({ loading: true, error: null });
      const newEvent = await addEvent({
        summary: event.title,
        description: event.description,
        start: event.start,
        end: event.end
      });
      
      set(state => ({
        events: [...state.events, {
          id: newEvent.id!,
          title: event.title,
          description: event.description,
          start: event.start,
          end: event.end,
          color: event.color
        }],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
  setView: (view) => set({ view }),
  clearError: () => set({ error: null })
}));