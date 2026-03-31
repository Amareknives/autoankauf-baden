import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
  // Resolve relative path to absolute so it works from any cwd
  const filePath = dbUrl.replace(/^file:/, '')
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath)

  const adapter = new PrismaBetterSqlite3({ url: absolutePath })
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
