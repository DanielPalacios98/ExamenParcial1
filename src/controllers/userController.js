const userService = require("../services/userService");

async function listBookings(req, res, next) {
  try {
    return res.json(await userService.listUserBookings(req.params.id));
  } catch (error) {
    return next(error);
  }
}

module.exports = { listBookings };
