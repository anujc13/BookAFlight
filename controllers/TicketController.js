const { flight } = require("../models");
const { ticket } = require("../models");

exports.viewTickets = async(req, res) => {
    const { flightId } = req.body;
    const targetFlight = await flight.findOne({ where: { flightId: flightId }});
    if (!targetFlight) {
        res.status(400).json("Flight doesn't exist!");
    } else {
        res.status(200).json(await ticket.findAll({ where : { flightId: flightId }}));
    }
};