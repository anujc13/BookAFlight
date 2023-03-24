const express = require("express");
const app = express();
const db = require("./models");
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// import router middleware
const bookingRoute = require("./routes/Booking");
const customerRoute = require("./routes/Customer");
const flightRoute = require("./routes/Flight");
const planeModelRoute = require("./routes/PlaneModel");
const seatPositionRoute = require("./routes/SeatPosition");
const ticketRoute = require("./routes/Ticket");

app.use("/booking", bookingRoute);
app.use("/customer", customerRoute);
app.use("/flight", flightRoute);
app.use("/planeModel", planeModelRoute);
app.use("/seatPosition", seatPositionRoute);
app.use("/ticket", ticketRoute);

db.sequelize.sync().then(() => {

    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
    });

    // seeding database
    db.planeModel.count().then(async numPlaneModels => {
        if (numPlaneModels === 0) {
            // create Boeing 737 plane model
            console.log("\n\n\nNo data found. Auto-generating for Boeing 737...\n\tplaneModel\n\tseatPosition\n\tflight\n\tticket\n\n\n");
            await db.planeModel.create({
                modelName: "Boeing737",
                totalOccupancy: 160,
            });

            // populate seats for Boeing 737
            await db.planeModel.findOne().then(async res => {
                let modelId = res.dataValues.id;
                
                // first class
                for (let i = 3; i < 7; i++) {
                    for (let j = 1; j < 7; j++) {
                        if (j < 3 || j > 4) {
                            await db.seatPosition.create({
                                row: i,
                                col: j,
                                class: 2,
                                planeModelId: modelId,
                            });
                        }
                    }
                }
                // premium economy
                for (let i = 7; i < 16; i++) {
                    if (i < 10 || i > 13) {
                        for (let j = 1; j < 7; j++) {
                            await db.seatPosition.create({
                                row: i,
                                col: j,
                                class: 1,
                                planeModelId: modelId,
                            });
                        }
                    }
                }
                // economy
                for (let i = 10; i < 31; i++) {
                    if (i < 14 || i > 15) {
                        for (let j = 1; j < 7; j++) {
                            await db.seatPosition.create({
                                row: i,
                                col: j,
                                class: 0,
                                planeModelId: modelId,
                            });
                        }
                    }
                }
            });
            
            // create three flights using Boeing 737
            await db.planeModel.findOne().then(async res => {
                let modelId = res.dataValues.id;
                let departure = new Date(2024, 1, 1, 6, 30, 0);
                let arrival = new Date(2024, 1, 1, 9, 30, 0);
                await db.flight.create({
                    sourceAirport: "JFK",
                    destinationAirport: "LAX",
                    departureTime: departure,
                    arrivalTime: arrival,
                    duration: (arrival - departure)/(1000*60), // hrs
                    airline: "JetBlue",
                    basePrice: 200,
                    planeModelId: modelId,
                });
            });
            await db.planeModel.findOne().then(async res => {
                let modelId = res.dataValues.id;
                let departure = new Date(2024, 3, 1, 6, 45, 0);
                let arrival = new Date(2024, 3, 1, 11, 45, 0);
                await db.flight.create({
                    sourceAirport: "LAX",
                    destinationAirport: "ANC",
                    departureTime: departure,
                    arrivalTime: arrival,
                    duration: (arrival - departure)/(1000*60), // min
                    airline: "United",
                    basePrice: 350,
                    planeModelId: modelId,
                });
            });
            await db.planeModel.findOne().then(async res => {
                let modelId = res.dataValues.id;
                let departure = new Date(2023, 5, 2, 6, 15, 0);
                let arrival = new Date(2023, 5, 2, 16, 15, 0);
                await db.flight.create({
                    sourceAirport: "JFK",
                    destinationAirport: "ANC",
                    departureTime: departure,
                    arrivalTime: arrival,
                    duration: (arrival - departure)/(1000*60), // min
                    airline: "United",
                    basePrice: 600,
                    planeModelId: modelId,
                });
            });

            // generate tickets based on flights
            await db.flight.findAll().then(async allFlights => {
                allFlights.forEach(async flight => {
                    let flightObj = flight.dataValues;
                    await db.seatPosition.findAll({ where : {planeModelId: flightObj.planeModelId}}).then(async allSeats => {
                        allSeats.forEach(async seat => {
                            let seatObj = seat.dataValues;
                            await db.ticket.create({
                                price: flightObj.basePrice*((seatObj.class*0.25) + 1),
                                extraBaggage: 0,
                                mealAvailable: 1,
                                mealOption: 2,
                                purchased: 0,
                                flightId: flightObj.id,
                                seatPositionId: seatObj.id,
                            });
                        });
                    });
                });
            });
        }
    });

});