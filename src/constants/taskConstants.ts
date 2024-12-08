export const TASK_PRIORITIES = {
  low: {
    label: 'Low',
    color: 'success',
    icon: '🟢'
  },
  medium: {
    label: 'Medium',
    color: 'warning',
    icon: '🟡'
  },
  high: {
    label: 'High',
    color: 'danger',
    icon: '🔴'
  }
} as const;

export const TASK_STATUSES = {
  todo: {
    label: 'To Do',
    color: 'default',
    icon: '📝'
  },
  in_progress: {
    label: 'In Progress',
    color: 'primary',
    icon: '⏳'
  },
  completed: {
    label: 'Completed',
    color: 'success',
    icon: '✅'
  },
  on_hold: {
    label: 'On Hold',
    color: 'warning',
    icon: '⏸️'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'danger',
    icon: '❌'
  }
} as const;

export const TASK_CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Finance',
  'Home',
  'Education',
  'Other'
] as const;