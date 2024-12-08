import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

export const sendTaskNotification = async (task: {
  title: string;
  priority: string;
  status: string;
  dueDate?: string;
}) => {
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      task_title: task.title,
      task_priority: task.priority,
      task_status: task.status,
      task_due_date: task.dueDate || 'No due date',
      to_email: 'hlsitech@gmail.com',
    }, PUBLIC_KEY);
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};