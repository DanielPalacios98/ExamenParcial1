const { createPrismaClient } = require("../utils/prisma");
const HttpError = require("../utils/httpError");

const prisma = createPrismaClient();

async function createSchedule({ court, startTime, endTime }) {
  if (!court || !startTime || !endTime) {
    throw new HttpError(400, "court, startTime y endTime son obligatorios");
  }
  return prisma.schedule.create({ data: { court, startTime, endTime } });
}

async function listBookings() {
  return prisma.booking.findMany({
    include: { user: true, schedule: true },
    orderBy: [{ date: "asc" }, { id: "asc" }],
  });
}

module.exports = { createSchedule, listBookings };
