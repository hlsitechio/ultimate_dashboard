// Use localStorage for data persistence
const STORAGE_KEY = 'dashboard_data';

interface StorageData {
  notes: any[];
  users: any[];
  tasks: any[];
}

const getStorageData = (): StorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { notes: [], users: [], tasks: [] };
};

const setStorageData = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const db = {
  query: async (table: keyof StorageData, action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE', data?: any) => {
    const storage = getStorageData();
    
    switch (action) {
      case 'SELECT':
        return storage[table];
      case 'INSERT':
        storage[table].push({ id: Date.now(), ...data });
        setStorageData(storage);
        return [data];
      case 'UPDATE':
        storage[table] = storage[table].map((item: any) => 
          item.id === data.id ? { ...item, ...data } : item
        );
        setStorageData(storage);
        return [data];
      case 'DELETE':
        storage[table] = storage[table].filter((item: any) => item.id !== data.id);
        setStorageData(storage);
        return [];
      default:
        throw new Error('Invalid action');
    }
  }
};