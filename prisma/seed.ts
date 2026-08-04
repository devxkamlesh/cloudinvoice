import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.info("Seed intentionally contains no customer or invoice data.");
}

main().finally(() => prisma.$disconnect());
