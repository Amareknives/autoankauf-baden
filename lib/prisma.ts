import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

function createPrismaClient() {
  const url = new URL(process.env.DIRECT_URL!)
  // Supabase direct connections are IPv6 only.
  // pg.Pool fails to resolve the hostname to IPv6 — use the pre-resolved IPv6 address.
  const host = process.env.SUPABASE_DB_IPV6 || url.hostname
  const pool = new pg.Pool({
    host,
    port: parseInt(url.port || '5432'),
    database: url.pathname.replace(/^\//, ''),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
