import { google } from 'googleapis';

const FOLDER_ID = '1yDaMjrkFWKs2fmmF0Rl6lWkkAjBHOczA';
const API_KEY = 'AIzaSyBi5xsmhW3n-1_vaJ5SB_-4rhwa-TSO1m0';
const CLIENT_ID = '558707488708-v76vgf0dlsqbhj3egm73h9vj99kgvet3.apps.googleusercontent.com';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

let auth: any = null;

export const initGoogleDrive = async () => {
  try {
    const token = localStorage.getItem('google_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    auth = new google.auth.OAuth2(CLIENT_ID);
    auth.setCredentials({ access_token: token });

    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to initialize Google Drive:', error);
    throw error;
  }
};

export const uploadToDrive = async (file: File, parentFolderId = FOLDER_ID) => {
  try {
    const drive = await initGoogleDrive();
    
    const fileMetadata = {
      name: file.name,
      parents: [parentFolderId]
    };

    const media = {
      mimeType: file.type,
      body: file
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, mimeType, size, webViewLink'
    });

    return response.data;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

export const listDriveFiles = async (folderId = FOLDER_ID) => {
  try {
    const drive = await initGoogleDrive();
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, size, webViewLink, thumbnailLink)',
      orderBy: 'modifiedTime desc'
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Failed to list files:', error);
    throw error;
  }
};

export const deleteDriveFile = async (fileId: string) => {
  try {
    const drive = await initGoogleDrive();
    await drive.files.delete({ fileId });
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};

export const downloadDriveFile = async (fileId: string) => {
  try {
    const drive = await initGoogleDrive();
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to download file:', error);
    throw error;
  }
};

export const createDriveFolder = async (name: string, parentFolderId = FOLDER_ID) => {
  try {
    const drive = await initGoogleDrive();
    
    const fileMetadata = {
      name: name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name'
    });

    return response.data;
  } catch (error) {
    console.error('Failed to create folder:', error);
    throw error;
  }
};