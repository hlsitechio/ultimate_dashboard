import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface Note {
  id: number;
  user_id: string;
  name: string;
  content?: string;
  file_type?: string;
  file_size?: number;
  file_url?: string;
  created_at: Date;
  updated_at: Date;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  updateNote: (id: number, note: Partial<Note>) => Promise<void>;
  removeNote: (id: number) => Promise<void>;
}

// Use localStorage for temporary storage
const STORAGE_KEY = 'notes_data';

export const useNotesStore = create<NotesState>((set) => ({
  notes: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
  loading: false,
  error: null,

  fetchNotes: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      set({ notes: notes.filter((note: Note) => note.user_id === user.uid), loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addNote: async (note) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newNote = {
        ...note,
        id: Date.now(),
        user_id: user.uid,
        created_at: new Date(),
        updated_at: new Date()
      };
      notes.push(newNote);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      set(state => ({
        notes: [newNote, ...state.notes],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateNote: async (id, note) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const updatedNotes = notes.map((n: Note) =>
        n.id === id && n.user_id === user.uid
          ? { ...n, ...note, updated_at: new Date() }
          : n
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      set(state => ({
        notes: state.notes.map(n =>
          n.id === id ? { ...n, ...note, updated_at: new Date() } : n
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  removeNote: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const filteredNotes = notes.filter((n: Note) => !(n.id === id && n.user_id === user.uid));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));