const express = require("express");
const router = express.Router();
const controller = require("../controllers/FlightController");
const { validateToken } = require("../middleware/auth");

// post flight - must be logged in and have level 3 authorization
router.post("/createflight", validateToken, controller.createFlight);

// filter flights
router.get("/search", controller.search);

module.exports = router;