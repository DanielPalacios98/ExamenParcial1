const { createPrismaClient } = require("../utils/prisma");
const HttpError = require("../utils/httpError");

const prisma = createPrismaClient();

async function authorizeBooking(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next(new HttpError(404, "Reserva no encontrada"));
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return next(new HttpError(404, "Reserva no encontrada"));
    if (req.user.role !== "ADMIN" && booking.userId !== Number(req.user.id)) {
      return next(new HttpError(403, "No tienes permiso para esta reserva"));
    }
    req.booking = booking;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authorizeBooking;
