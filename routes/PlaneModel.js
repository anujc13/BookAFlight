const express = require("express");
const router = express.Router();
const controller = require("../controllers/PlaneModelController");
const { validateToken } = require("../middleware/auth");

module.exports = router;