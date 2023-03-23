const { customer } = require("../models");
const { booking } = require("../models");
const { ticket } = require("../models")

// reserve booking
exports.reserve = async (req, res) => {
    const { accessToken } = req.header;
    const {
        ticketId
    } = req.body;
    const user = await customer.findOne({ where: { rememberToken: accessToken }});
    if (!user) {
        req.status(400).json("Not logged in!");
    } else {
        
    }

};

// confirm booking
exports.confirm = async (req, res) => {

};

// cancel booking
exports.cancel = async (req, res) => {

};