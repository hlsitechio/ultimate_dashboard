import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { sendTaskNotification } from '../lib/emailjs';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: async (taskData) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set(state => ({
          tasks: [newTask, ...state.tasks]
        }));

        // Send email notification
        await sendTaskNotification(newTask);
      },

      updateTask: async (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          )
        }));

        const updatedTask = get().tasks.find(t => t.id === id);
        if (updatedTask) {
          await sendTaskNotification(updatedTask);
        }
      },

      deleteTask: (id) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },

      setTaskStatus: async (id, status) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, status, updatedAt: new Date().toISOString() }
              : task
          )
        }));

        const updatedTask = get().tasks.find(t => t.id === id);
        if (updatedTask) {
          await sendTaskNotification(updatedTask);
        }
      },
    }),
    {
      name: 'task-storage',
    }
  )
);