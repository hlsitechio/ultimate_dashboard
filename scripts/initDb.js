import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config();

const sql = neon(process.env.DATABASE_URL);

async function initNotesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        content TEXT,
        file_type VARCHAR(50),
        file_size INTEGER,
        file_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Notes table initialized successfully');
  } catch (error) {
    console.error('Error initializing notes table:', error);
    process.exit(1);
  }
}

initNotesTable();