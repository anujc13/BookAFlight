const { flight } = require("../models");
const { ticket } = require("../models");

exports.viewTickets = async(req, res) => {
    const { flightId } = req.body;
    const targetFlight = await flight.findOne({ where: { id: flightId }});
    if (!targetFlight) return res.status(400).json({ error: "Flight doesn't exist!" });
    return res.status(200).json(await ticket.findAll({ where : { flightId: flightId }}));
};