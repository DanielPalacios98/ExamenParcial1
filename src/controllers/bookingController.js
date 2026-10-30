const bookingService = require("../services/bookingService");

async function create(req, res, next) {
  try {
    return res.status(201).json(await bookingService.createBooking(req.user.id, req.body || {}));
  } catch (error) {
    return next(error);
  }
}

async function getOne(req, res, next) {
  try {
    return res.json(await bookingService.getBooking(req.params.id));
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    return res.json(await bookingService.updateBooking(req.params.id, req.body || {}));
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await bookingService.deleteBooking(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { create, getOne, update, remove };
