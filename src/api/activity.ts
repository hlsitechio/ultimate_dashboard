import { sql } from '../lib/db';

export async function logActivity({
  userId,
  action,
  details
}: {
  userId: number;
  action: string;
  details?: Record<string, any>;
}) {
  return await sql`
    INSERT INTO activity_logs (user_id, action, details)
    VALUES (${userId}, ${action}, ${JSON.stringify(details)})
    RETURNING *
  `;
}

export async function getRecentActivity() {
  return await sql`
    SELECT al.*, u.name as user_name
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 10
  `;
}