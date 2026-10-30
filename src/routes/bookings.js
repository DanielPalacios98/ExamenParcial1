const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeBooking = require("../middlewares/authorizeBooking");
const controller = require("../controllers/bookingController");

const router = Router();
router.use(authenticateToken);
router.post("/", controller.create);
router.get("/:id", authorizeBooking, controller.getOne);
router.put("/:id", authorizeBooking, controller.update);
router.delete("/:id", authorizeBooking, controller.remove);

module.exports = router;
