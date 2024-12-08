import { create } from 'zustand';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
  price?: number;
  notes?: string;
  createdAt: Date;
}

interface ShoppingState {
  items: ShoppingItem[];
  categories: string[];
  selectedCategory: string | null;
  addItem: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, item: Partial<ShoppingItem>) => void;
  deleteItem: (id: string) => void;
  toggleComplete: (id: string) => void;
  setSelectedCategory: (category: string | null) => void;
}

export const useShoppingStore = create<ShoppingState>((set) => ({
  items: [
    {
      id: '1',
      name: 'Milk',
      quantity: 2,
      category: 'Dairy',
      completed: false,
      price: 3.99,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Bread',
      quantity: 1,
      category: 'Bakery',
      completed: false,
      price: 2.49,
      createdAt: new Date()
    }
  ],
  categories: ['Dairy', 'Bakery', 'Produce', 'Meat', 'Pantry', 'Household'],
  selectedCategory: null,
  addItem: (item) =>
    set((state) => ({
      items: [
        {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        },
        ...state.items,
      ],
      categories: item.category && !state.categories.includes(item.category)
        ? [...state.categories, item.category]
        : state.categories,
    })),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  toggleComplete: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));