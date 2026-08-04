import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Serverless-optimized Prisma Client configuration
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Cache the Prisma Client in development to avoid creating multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown for serverless environments
if (process.env.NODE_ENV === "production") {
  // For Lambda, we don't want to disconnect on every invocation
  // Lambda freezes the execution context, so the connection stays warm
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}
