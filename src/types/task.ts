export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  category?: string;
  assignee?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}