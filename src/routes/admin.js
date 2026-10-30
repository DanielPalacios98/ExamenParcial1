const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeAdmin = require("../middlewares/role");
const controller = require("../controllers/adminController");

const router = Router();
router.use(authenticateToken, authorizeAdmin);
router.post("/schedules", controller.createSchedule);
router.get("/bookings", controller.listBookings);

module.exports = router;
