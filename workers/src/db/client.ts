import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../../../lib/db/schema'

export function createClient(database: D1Database) {
  return drizzle(database, { schema })
}
