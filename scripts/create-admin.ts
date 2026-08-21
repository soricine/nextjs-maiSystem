import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

console.log("Starting create-admin script...");

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to database...");

  await prisma.$connect();

  console.log("Database connected.");

  const name = "Main Administrator";
  const email = "admin@admin.com";
  const password = "12345678";

  console.log("Checking if admin already exists...");

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    console.log(`User already exists: ${email}`);
    return;
  }

  console.log("Hashing password...");

  const hashedPassword = await bcrypt.hash(password, 12);

  console.log("Creating admin...");

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("");
  console.log("ADMIN CREATED SUCCESSFULLY");
  console.log("----------------------------");
  console.log("Name:", admin.name);
  console.log("Email:", admin.email);
  console.log("Role:", admin.role);
  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error("CREATE ADMIN ERROR:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
  });