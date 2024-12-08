import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = '558707488708-v76vgf0dlsqbhj3egm73h9vj99kgvet3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBi5xsmhW3n-1_vaJ5SB_-4rhwa-TSO1m0';
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

const oauth2Client = new OAuth2Client({
  clientId: CLIENT_ID,
  redirectUri: import.meta.env.VITE_APP_URL
});

export async function authenticateGmail() {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });

    // Open popup for OAuth2 flow
    const popup = window.open(url, 'Gmail Auth', 'width=600,height=600');
    
    return new Promise((resolve, reject) => {
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'oauth2callback') {
          const { code } = event.data;
          try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            localStorage.setItem('gmail_token', tokens.access_token!);
            resolve(tokens.access_token);
          } catch (error) {
            reject(error);
          } finally {
            popup?.close();
          }
        }
      });
    });
  } catch (error) {
    console.error('Gmail authentication error:', error);
    throw error;
  }
}

export async function listEmails(maxResults = 20) {
  try {
    const token = localStorage.getItem('gmail_token');
    if (!token) {
      throw new Error('Not authenticated with Gmail');
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      labelIds: ['INBOX']
    });

    const messages = await Promise.all(
      response.data.messages?.map(async (message) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!
        });
        return details.data;
      }) || []
    );

    return messages;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

export async function sendEmail(to: string, subject: string, body: string) {
  try {
    const token = localStorage.getItem('gmail_token');
    if (!token) {
      throw new Error('Not authenticated with Gmail');
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const message = [
      `To: ${to}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function markEmailAsRead(messageId: string) {
  try {
    const token = localStorage.getItem('gmail_token');
    if (!token) {
      throw new Error('Not authenticated with Gmail');
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });
  } catch (error) {
    console.error('Error marking email as read:', error);
    throw error;
  }
}

export function parseEmailBody(message: any): string {
  try {
    let body = '';
    if (message.payload?.body?.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString();
    } else if (message.payload?.parts) {
      const textPart = message.payload.parts.find((part: any) => 
        part.mimeType === 'text/plain'
      );
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString();
      }
    }
    return body;
  } catch (error) {
    console.error('Error parsing email body:', error);
    return 'Unable to parse email content';
  }
}

export function getHeaderValue(message: any, headerName: string): string {
  return message.payload?.headers?.find((h: any) => 
    h.name.toLowerCase() === headerName.toLowerCase()
  )?.value || '';
}