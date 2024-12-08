import { openDB } from 'idb';

const DB_NAME = 'FileStorageDB';
const STORE_NAME = 'files';
const DB_VERSION = 1;

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  data: string;
  thumbnail?: string;
}

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

const readAsDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const createThumbnail = async (file: File): Promise<string | undefined> => {
  if (!file.type.startsWith('image/')) return undefined;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => {
      const MAX_SIZE = 200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(file.type, 0.7));
    };
    img.src = URL.createObjectURL(file);
  });
};

export const saveFile = async (file: File): Promise<StoredFile> => {
  try {
    const data = await readAsDataURL(file);
    const thumbnail = await createThumbnail(file);

    const fileData: StoredFile = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: Date.now(),
      data,
      thumbnail
    };

    const db = await initDB();
    await db.put(STORE_NAME, fileData);

    return fileData;
  } catch (error) {
    console.error('Failed to save file:', error);
    throw error;
  }
};

export const getFiles = async (): Promise<StoredFile[]> => {
  try {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error('Failed to get files:', error);
    throw error;
  }
};

export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    const db = await initDB();
    await db.delete(STORE_NAME, fileId);
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};

export const downloadFile = async (fileId: string): Promise<ArrayBuffer> => {
  try {
    const db = await initDB();
    const file = await db.get(STORE_NAME, fileId);
    if (!file) throw new Error('File not found');

    // Convert base64 to ArrayBuffer
    const response = await fetch(file.data);
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Failed to download file:', error);
    throw error;
  }
};

export const getStorageInfo = async () => {
  try {
    const files = await getFiles();
    const used = files.reduce((total, file) => total + file.size, 0);
    
    // Set a reasonable local storage limit (500MB)
    const total = 500 * 1024 * 1024;
    
    return {
      total,
      used,
      available: total - used
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    throw error;
  }
};