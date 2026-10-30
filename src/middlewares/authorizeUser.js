const HttpError = require("../utils/httpError");

function authorizeUser(req, res, next) {
  const isAdmin = req.user?.role === "ADMIN";
  const isOwner = Number(req.params.id) === Number(req.user?.id);
  if (!isAdmin && !isOwner) {
    return next(new HttpError(403, "No tienes permiso para consultar este usuario"));
  }
  return next();
}

module.exports = authorizeUser;
