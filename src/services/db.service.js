require("dotenv").config();
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the Prisma Client
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

module.exports = prisma;
