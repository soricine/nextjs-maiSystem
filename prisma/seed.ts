import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    {
      name: "Administrator",
      email: "admin@example.com",
      password: "Admin123!",
      role: Role.ADMIN,
    },
    {
      name: "Staff User",
      email: "staff@example.com",
      password: "Staff123!",
      role: Role.STAFF,
    },
    {
      name: "Customer User",
      email: "customer@example.com",
      password: "Customer123!",
      role: Role.CUSTOMER,
    },
  ];

  for (const account of accounts) {
    const password = await bcrypt.hash(account.password, 12);

    await prisma.user.upsert({
      where: {
        email: account.email,
      },
      update: {
        name: account.name,
        password,
        role: account.role,
      },
      create: {
        name: account.name,
        email: account.email,
        password,
        role: account.role,
      },
    });
  }

  console.log("All accounts created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });