const express = require("express");
const router = express.Router();
const controller = require("../controllers/CustomerController");
const { validateToken } = require("../middleware/auth");

// signup
router.post("/signup", controller.signup);

// login
router.post("/login", controller.login);

// get points - must be logged in
router.get("/viewpoints", validateToken, controller.viewPoints);

// change password - must be logged in
router.patch("/changepassword", validateToken, controller.changePassword);

// deleteAccount - must be logged in
router.delete("/deleteaccount", validateToken, controller.deleteAccount);

module.exports = router;