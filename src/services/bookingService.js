const { createPrismaClient } = require("../utils/prisma");
const HttpError = require("../utils/httpError");

const prisma = createPrismaClient();

function normalizeInput({ date, scheduleId }) {
  const normalizedScheduleId = Number(scheduleId);
  if (!date || !Number.isInteger(normalizedScheduleId)) {
    throw new HttpError(400, "date y scheduleId son obligatorios");
  }
  return { date: String(date), scheduleId: normalizedScheduleId };
}

async function ensureSchedule(scheduleId) {
  const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });
  if (!schedule) throw new HttpError(404, "Horario no encontrado");
}

async function ensureAvailable(date, scheduleId, ignoredId) {
  const existing = await prisma.booking.findFirst({
    where: { date, scheduleId, ...(ignoredId ? { id: { not: ignoredId } } : {}) },
  });
  if (existing) throw new HttpError(400, "El horario ya está ocupado");
}

async function createBooking(userId, input) {
  const data = normalizeInput(input);
  await ensureSchedule(data.scheduleId);
  await ensureAvailable(data.date, data.scheduleId);
  return prisma.booking.create({
    data: {
      date: data.date,
      user: { connect: { id: Number(userId) } },
      schedule: { connect: { id: data.scheduleId } },
    },
    include: { user: true, schedule: true },
  });
}

async function getBooking(id) {
  return prisma.booking.findUnique({ where: { id: Number(id) }, include: { user: true, schedule: true } });
}

async function updateBooking(id, input) {
  const data = normalizeInput(input);
  await ensureSchedule(data.scheduleId);
  await ensureAvailable(data.date, data.scheduleId, Number(id));
  return prisma.booking.update({
    where: { id: Number(id) },
    data,
    include: { user: true, schedule: true },
  });
}

async function deleteBooking(id) {
  await prisma.booking.delete({ where: { id: Number(id) } });
}

module.exports = { createBooking, getBooking, updateBooking, deleteBooking };
