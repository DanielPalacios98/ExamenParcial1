const adminService = require("../services/adminService");

async function createSchedule(req, res, next) {
  try {
    const schedule = await adminService.createSchedule(req.body || {});
    return res.status(201).json(schedule);
  } catch (error) {
    return next(error);
  }
}

async function listBookings(req, res, next) {
  try {
    return res.json(await adminService.listBookings());
  } catch (error) {
    return next(error);
  }
}

module.exports = { createSchedule, listBookings };
