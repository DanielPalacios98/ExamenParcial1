const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeUser = require("../middlewares/authorizeUser");
const controller = require("../controllers/userController");

const router = Router();
router.get("/:id/bookings", authenticateToken, authorizeUser, controller.listBookings);

module.exports = router;
