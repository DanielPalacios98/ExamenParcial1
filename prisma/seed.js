require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("usuario123", 10);

  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Paulo Galarza",
      email: "paulo.galarza@example.com",
      password,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: process.env.SEED_USER_NAME || "Daniel Palacios",
      email: process.env.SEED_USER_EMAIL || "l00056071@espe.edu.ec",
      password: userPassword,
      role: "USER",
    },
  });

  const basketball = await prisma.schedule.create({
    data: { court: "Básquet 1", startTime: "08:00", endTime: "10:00" },
  });
  const tennis = await prisma.schedule.create({
    data: { court: "Tenis 1", startTime: "10:00", endTime: "12:00" },
  });

  await prisma.booking.create({
    data: {
      date: "2026-11-11",
      user: { connect: { id: user.id } },
      schedule: { connect: { id: basketball.id } },
    },
  });
  await prisma.booking.create({
    data: {
      date: "2026-11-11",
      user: { connect: { id: admin.id } },
      schedule: { connect: { id: tennis.id } },
    },
  });

  console.log("Seed completado", { admin: admin.email, user: user.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
