import { create } from 'zustand';
import { initGoogleAuth } from '../lib/googleAuth';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      // For demo purposes, simulate authentication
      const user: User = {
        uid: '123',
        email,
        displayName: email.split('@')[0],
        photoURL: null
      };
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      // For demo purposes, simulate registration
      const user: User = {
        uid: '123',
        email,
        displayName: email.split('@')[0],
        photoURL: null
      };
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  signInWithProvider: async (provider) => {
    try {
      set({ loading: true, error: null });
      
      if (provider === 'google') {
        const scopes = [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/gmail.modify'
        ];

        const accessToken = await initGoogleAuth(scopes);
        
        // Get user info
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to get user info');
        }
        
        const userInfo = await response.json();
        
        const user: User = {
          uid: userInfo.id,
          email: userInfo.email,
          displayName: userInfo.name,
          photoURL: userInfo.picture
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('google_token', accessToken);
        
        set({ user, loading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      localStorage.removeItem('user');
      localStorage.removeItem('google_token');
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  }
}));

// Initialize user from localStorage
const savedUser = localStorage.getItem('user');
if (savedUser) {
  useAuthStore.setState({ user: JSON.parse(savedUser) });
}