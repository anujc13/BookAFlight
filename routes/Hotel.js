// router.js
//const { API_KEY, API_SECRET } = require("./config");
const Amadeus = require("amadeus")
const amadeus = new Amadeus({
    clientId: 'QHX1gTf9QqTQ0RFbS9r8IkctsPd1PMh5',
    clientSecret: 'casjiyryVG9uAylR',
  });
const express = require("express");
const controller = require("../controllers/HotelController");
const router = express.Router();

router.get("/citySearch", controller.citySearch);
router.get("/hotelSearch", controller.hotelSearch);



const API = "api";

module.exports = router;