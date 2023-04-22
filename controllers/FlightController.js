const { flight } = require("../models");
const path = require("path");

exports.createFlight = async(req, res) => {
    const {
        sourceAirport,
        destinationAirport,
        departureTime,
        arrivalTime,
        duration,
        airline,
        planeModelId,
        basePrice,
    } = req.body;
    await flight.create({
        sourceAirport: sourceAirport,
        destinationAirport: destinationAirport,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        duration: duration,
        airline: airline,
        planeModelId: planeModelId,
        basePrice: basePrice,
    });
    res.status(200).json("Flight created succesfully!");
};

// search for flights
exports.search = async (req, res) => {
    // set up filter parameters - handles null parameters
    const reqParam = req.body;
    let filter = {};
    if (reqParam.sourceAirport) {
        filter.sourceAirport = reqParam.sourceAirport;
    }
    if (reqParam.destinationAirport) {
        filter.destinationAirport = reqParam.destinationAirport;
    }
    if (reqParam.departureTime) {
        filter.departureTime = reqParam.departureTime;
    }
    if (reqParam.arrivalTime) {
        filter.arrivalTime = reqParam.arrivalTime;
    }
    if (reqParam.byPrice) {
        res.status(200).json(await flight.findAll({ where: filter, order: [["basePrice", "ASC"]] }));
    } else {
        res.status(200).json(await flight.findAll({ where: filter }));
    }
};

exports.flightPage = (req, res) => {
    res.sendFile(path.join(__dirname, "/../views/search.html"));
}