import { google } from 'googleapis';

const API_KEY = 'AIzaSyBi5xsmhW3n-1_vaJ5SB_-4rhwa-TSO1m0';
const CALENDAR_ID = 'primary';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const calendar = google.calendar({ version: 'v3', auth: API_KEY });

export async function listEvents() {
  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items;
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
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
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
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error adding calendar event:', error);
    throw error;
  }
}

export async function updateEvent(eventId: string, event: {
  summary?: string;
  description?: string;
  start?: Date;
  end?: Date;
}) {
  try {
    const response = await calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: event.start ? {
          dateTime: event.start.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        } : undefined,
        end: event.end ? {
          dateTime: event.end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        } : undefined,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId,
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
}