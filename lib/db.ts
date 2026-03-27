import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/schema/merchants';

// For Supabase pooler (port 6543) we must disable prefetch
// as it is not supported by the Supabase connection pooler.
const client = postgres(process.env.DATABASE_URL!, {
    prepare: false, // required for Supabase pgBouncer / transaction mode
});

export const db = drizzle(client, { schema });
