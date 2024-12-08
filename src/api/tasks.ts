import { sql } from '../lib/db';

export async function getTasks(userId: number) {
  return await sql`
    SELECT * FROM tasks
    WHERE user_id = ${userId}
    ORDER BY due_date ASC
  `;
}

export async function createTask({
  userId,
  title,
  description,
  dueDate
}: {
  userId: number;
  title: string;
  description?: string;
  dueDate?: Date;
}) {
  return await sql`
    INSERT INTO tasks (user_id, title, description, due_date)
    VALUES (${userId}, ${title}, ${description}, ${dueDate})
    RETURNING *
  `;
}

export async function updateTaskStatus(taskId: number, status: string) {
  return await sql`
    UPDATE tasks
    SET status = ${status}
    WHERE id = ${taskId}
    RETURNING *
  `;
}