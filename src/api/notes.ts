import { sql } from '../lib/db';

export interface Note {
  id: number;
  user_id: string;
  title: string;
  content?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  created_at: Date;
  updated_at: Date;
  tags?: string[];
}

export async function getNotes(userId: string): Promise<Note[]> {
  return await sql<Note[]>`
    SELECT n.*, 
           array_agg(t.name) as tags
    FROM notes n
    LEFT JOIN notes_tags nt ON n.id = nt.note_id
    LEFT JOIN tags t ON nt.tag_id = t.id
    WHERE n.user_id = ${userId}
    GROUP BY n.id
    ORDER BY n.updated_at DESC;
  `;
}

export async function createNote(
  userId: string,
  note: Pick<Note, 'title' | 'content' | 'file_path' | 'file_type' | 'file_size'>,
  tags?: string[]
): Promise<Note> {
  const [createdNote] = await sql<Note[]>`
    INSERT INTO notes (user_id, title, content, file_path, file_type, file_size)
    VALUES (${userId}, ${note.title}, ${note.content}, ${note.file_path}, ${note.file_type}, ${note.file_size})
    RETURNING *;
  `;

  if (tags && tags.length > 0) {
    // Insert tags and create associations
    for (const tagName of tags) {
      const [tag] = await sql`
        INSERT INTO tags (name)
        VALUES (${tagName})
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id;
      `;

      await sql`
        INSERT INTO notes_tags (note_id, tag_id)
        VALUES (${createdNote.id}, ${tag.id})
        ON CONFLICT DO NOTHING;
      `;
    }
  }

  return createdNote;
}

export async function deleteNote(noteId: number, userId: string): Promise<void> {
  await sql`
    DELETE FROM notes
    WHERE id = ${noteId} AND user_id = ${userId};
  `;
}

export async function updateNote(
  noteId: number,
  userId: string,
  updates: Partial<Note>,
  tags?: string[]
): Promise<Note> {
  const [updatedNote] = await sql<Note[]>`
    UPDATE notes
    SET title = ${updates.title},
        content = ${updates.content},
        file_path = ${updates.file_path},
        file_type = ${updates.file_type},
        file_size = ${updates.file_size},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${noteId} AND user_id = ${userId}
    RETURNING *;
  `;

  if (tags) {
    // Remove existing tags
    await sql`
      DELETE FROM notes_tags
      WHERE note_id = ${noteId};
    `;

    // Add new tags
    for (const tagName of tags) {
      const [tag] = await sql`
        INSERT INTO tags (name)
        VALUES (${tagName})
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id;
      `;

      await sql`
        INSERT INTO notes_tags (note_id, tag_id)
        VALUES (${noteId}, ${tag.id});
      `;
    }
  }

  return updatedNote;
}