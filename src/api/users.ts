import { sql } from '../lib/db';

export async function getUsers() {
  return await sql`SELECT * FROM users ORDER BY created_at DESC`;
}

export async function createUser({ name, email }: { name: string; email: string }) {
  return await sql`
    INSERT INTO users (name, email)
    VALUES (${name}, ${email})
    RETURNING *
  `;
}

export async function getUserActivity(userId: number) {
  return await sql`
    SELECT * FROM activity_logs
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 10
  `;
}