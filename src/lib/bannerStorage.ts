import { openDB } from 'idb';

const DB_NAME = 'BannerDB';
const STORE_NAME = 'backgrounds';
const DB_VERSION = 1;

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveBannerBackground = async (data: string) => {
  const db = await initDB();
  await db.put(STORE_NAME, data, 'current');
};

export const getBannerBackground = async () => {
  const db = await initDB();
  return await db.get(STORE_NAME, 'current');
};

export const clearBannerBackground = async () => {
  const db = await initDB();
  await db.delete(STORE_NAME, 'current');
};