const { createPrismaClient } = require("../utils/prisma");

const prisma = createPrismaClient();

async function listUserBookings(userId) {
  return prisma.booking.findMany({
    where: { userId: Number(userId) },
    include: { schedule: true },
    orderBy: [{ date: "asc" }, { id: "asc" }],
  });
}

module.exports = { listUserBookings };
