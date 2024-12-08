import { create } from 'zustand';
import { 
  initOneDrive, 
  uploadFile, 
  listFiles, 
  downloadFile, 
  deleteFile, 
  createFolder 
} from '../lib/oneDrive';

interface OneDriveFile {
  id: string;
  name: string;
  size: number;
  lastModifiedDateTime: string;
  webUrl: string;
  folder?: { childCount: number };
}

interface OneDriveState {
  files: OneDriveFile[];
  currentPath: string;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  listFiles: (path?: string) => Promise<void>;
  downloadFile: (fileId: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  setCurrentPath: (path: string) => void;
  clearError: () => void;
}

export const useOneDriveStore = create<OneDriveState>((set, get) => ({
  files: [],
  currentPath: '/',
  loading: false,
  error: null,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true, error: null });
      await initOneDrive();
      set({ initialized: true });
      await get().listFiles();
      set({ loading: false });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        loading: false,
        initialized: false 
      });
      throw error;
    }
  },

  uploadFile: async (file: File) => {
    try {
      set({ loading: true, error: null });
      await uploadFile(file, get().currentPath);
      await get().listFiles(get().currentPath);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  listFiles: async (path = '/') => {
    try {
      set({ loading: true, error: null });
      const files = await listFiles(path);
      set({ files, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  downloadFile: async (fileId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await downloadFile(fileId);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteFile: async (fileId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteFile(fileId);
      await get().listFiles(get().currentPath);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createFolder: async (name: string) => {
    try {
      set({ loading: true, error: null });
      await createFolder(name, get().currentPath);
      await get().listFiles(get().currentPath);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  setCurrentPath: (path) => set({ currentPath: path }),
  clearError: () => set({ error: null })
}));