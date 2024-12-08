import { create } from 'zustand';
import { 
  listEmails, 
  sendEmail, 
  markEmailAsRead, 
  parseEmailBody, 
  getHeaderValue 
} from '../lib/googleApi';
import { initGoogleAuth } from '../lib/googleAuth';

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: Date;
  read: boolean;
  starred: boolean;
  labels: string[];
}

interface EmailState {
  emails: Email[];
  selectedEmail: Email | null;
  selectedFolder: 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash';
  loading: boolean;
  error: string | null;
  fetchEmails: () => Promise<void>;
  sendNewEmail: (to: string, subject: string, body: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  toggleStarred: (id: string) => void;
  setSelectedEmail: (email: Email | null) => void;
  setSelectedFolder: (folder: 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash') => void;
  connectGmail: () => Promise<void>;
}

export const useEmailStore = create<EmailState>((set, get) => ({
  emails: [],
  selectedEmail: null,
  selectedFolder: 'inbox',
  loading: false,
  error: null,

  connectGmail: async () => {
    try {
      set({ loading: true, error: null });
      const scopes = [
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.send'
      ];
      await initGoogleAuth(scopes);
      await get().fetchEmails();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchEmails: async () => {
    try {
      set({ loading: true, error: null });
      const gmailMessages = await listEmails();
      
      const formattedEmails: Email[] = gmailMessages.map(message => ({
        id: message.id,
        from: getHeaderValue(message, 'From'),
        to: getHeaderValue(message, 'To'),
        subject: getHeaderValue(message, 'Subject'),
        body: parseEmailBody(message),
        date: new Date(parseInt(message.internalDate)),
        read: !message.labelIds.includes('UNREAD'),
        starred: message.labelIds.includes('STARRED'),
        labels: message.labelIds || []
      }));

      set({ emails: formattedEmails, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  sendNewEmail: async (to: string, subject: string, body: string) => {
    try {
      set({ loading: true, error: null });
      await sendEmail(to, subject, body);
      await get().fetchEmails();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  markAsRead: async (id: string) => {
    try {
      await markEmailAsRead(id);
      set(state => ({
        emails: state.emails.map(email =>
          email.id === id ? { ...email, read: true } : email
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  toggleStarred: (id: string) => {
    set(state => ({
      emails: state.emails.map(email =>
        email.id === id ? { ...email, starred: !email.starred } : email
      )
    }));
  },

  setSelectedEmail: (email) => set({ selectedEmail: email }),
  setSelectedFolder: (folder) => set({ selectedFolder: folder })
}));