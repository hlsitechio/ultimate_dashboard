import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config();

const sql = neon(process.env.DATABASE_URL);

async function initDatabase() {
  try {
    // Create notes table
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        file_path TEXT,
        file_type VARCHAR(50),
        file_size INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create tags table
    await sql`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create notes_tags junction table
    await sql`
      CREATE TABLE IF NOT EXISTS notes_tags (
        note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (note_id, tag_id)
      );
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();