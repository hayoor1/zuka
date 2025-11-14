import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// Enable WebSocket for development
if (process.env.NODE_ENV === 'development') {
  neonConfig.webSocketConstructor = require('ws');
}

// Create connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

// Export all schema
export * from './schema';
