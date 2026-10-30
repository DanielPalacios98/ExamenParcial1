const HttpError = require("../utils/httpError");

function authorizeAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return next(new HttpError(403, "Admin role required"));
  }
  return next();
}

module.exports = authorizeAdmin;
