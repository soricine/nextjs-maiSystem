import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    console.log(`No user found with email: ${email}`);
    return;
  }

  if (user.role !== "ADMIN") {
    console.log(`${email} is not an ADMIN.`);
    return;
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      role: "STAFF",
    },
  });

  console.log(`ADMIN role removed from ${email}.`);
  console.log(`The account is now STAFF.`);
}

main()
  .catch((error) => {
    console.error("REMOVE ADMIN ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });