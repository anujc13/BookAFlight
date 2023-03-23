const express = require("express");
const router = express.Router();
const controller = require("../controllers/TicketController");
const { validateToken } = require("../middleware/auth");

// get tickets by flight
router.get("/viewTickets", controller.viewTickets);

module.exports = router;