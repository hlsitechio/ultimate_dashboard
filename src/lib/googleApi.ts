const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1';

async function getAccessToken() {
  const token = localStorage.getItem('google_token');
  if (!token) {
    throw new Error('Not authenticated with Google');
  }
  return token;
}

// Calendar API functions
export async function listEvents() {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `${CALENDAR_API}/calendars/primary/events?timeMin=${new Date().toISOString()}&maxResults=10&orderBy=startTime&singleEvents=true`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('google_token');
        throw new Error('Authentication expired. Please reconnect your Google account.');
      }
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

export async function addEvent(event: {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
}) {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `${CALENDAR_API}/calendars/primary/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.summary,
          description: event.description,
          start: {
            dateTime: event.start.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: event.end.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('google_token');
        throw new Error('Authentication expired. Please reconnect your Google account.');
      }
      throw new Error('Failed to add event');
    }

    return response.json();
  } catch (error) {
    console.error('Error adding calendar event:', error);
    throw error;
  }
}

// Gmail API functions
export async function listEmails() {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `${GMAIL_API}/users/me/messages?maxResults=20`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('google_token');
        throw new Error('Authentication expired. Please reconnect your Google account.');
      }
      throw new Error('Failed to fetch emails');
    }

    const data = await response.json();
    const messages = await Promise.all(
      data.messages.map(async (message: any) => {
        const details = await fetch(
          `${GMAIL_API}/users/me/messages/${message.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return details.json();
      })
    );

    return messages;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

export async function sendEmail(to: string, subject: string, body: string) {
  try {
    const token = await getAccessToken();
    const message = [
      `To: ${to}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const encodedMessage = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch(
      `${GMAIL_API}/users/me/messages/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedMessage
        })
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('google_token');
        throw new Error('Authentication expired. Please reconnect your Google account.');
      }
      throw new Error('Failed to send email');
    }

    return response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function markEmailAsRead(messageId: string) {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `${GMAIL_API}/users/me/messages/${messageId}/modify`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          removeLabelIds: ['UNREAD']
        })
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('google_token');
        throw new Error('Authentication expired. Please reconnect your Google account.');
      }
      throw new Error('Failed to mark email as read');
    }

    return response.json();
  } catch (error) {
    console.error('Error marking email as read:', error);
    throw error;
  }
}

export function parseEmailBody(message: any): string {
  try {
    let body = '';
    if (message.payload?.body?.data) {
      body = decodeURIComponent(escape(atob(
        message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/')
      )));
    } else if (message.payload?.parts) {
      const textPart = message.payload.parts.find((part: any) => 
        part.mimeType === 'text/plain'
      );
      if (textPart?.body?.data) {
        body = decodeURIComponent(escape(atob(
          textPart.body.data.replace(/-/g, '+').replace(/_/g, '/')
        )));
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