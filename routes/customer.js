const express = require("express");
const router = express.Router();
const { customer } = require("../models");

router.get("/", (req, res) => {
    
});
router.post("/", async (req, res) => {
    const post = req.body;
    await customer.create(customer);
    res.json(post);
});

module.exports = router;