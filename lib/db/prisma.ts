import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está configurada.");
}

const connectionUrl = new URL(databaseUrl);
connectionUrl.searchParams.delete("sslmode");

const adapter = new PrismaPg({
  connectionString: connectionUrl.toString(),
  ssl: { rejectUnauthorized: true },
});
const prisma = new PrismaClient({adapter});

export default prisma;