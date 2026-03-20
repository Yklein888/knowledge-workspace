import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Re-export operators
export {
  eq,
  and,
  or,
  desc,
  asc,
  isNull,
  isNotNull,
  lt,
  lte,
  gt,
  gte,
  like,
  inArray,
} from 'drizzle-orm'

// Lazy initialization to avoid build-time env var issues
let _db: ReturnType<typeof drizzle> | null = null

function createDb() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const client = postgres(databaseUrl, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: 'require',
  })
  return drizzle(client, { schema })
}

export function getDb() {
  if (!_db) {
    _db = createDb()
  }
  return _db
}

export type Database = ReturnType<typeof getDb>

// Re-export schema
export * from './schema'
