const express = require("express");
const router = express.Router();
const controller = require("../controllers/BookingController");
const { validateToken } = require("../middleware/auth");

// create booking - must be logged in
router.post("/reserve", validateToken, controller.reserve);

// router checkout - must be logged in
router.post("/checkout", validateToken, controller.checkout);


/*
// cancel booking - must be logged in
router.post("/cancel", validateToken, controller.cancel);
*/
module.exports = router;