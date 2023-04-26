const path = require("path");
const db = require("./models");
const axios = require("axios");
const express = require("express");
const Amadeus = require("amadeus");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// import router middleware
const bookingRoute = require("./routes/Booking");
const customerRoute = require("./routes/Customer");
const flightRoute = require("./routes/Flight");
const planeModelRoute = require("./routes/PlaneModel");
const seatPositionRoute = require("./routes/SeatPosition");
const ticketRoute = require("./routes/Ticket");
const hotelRoute = require("./routes/Hotel");


// establish routes, with default going to homepage and none going to invalidpage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/index.html"));
});
app.use("/booking", bookingRoute);
app.use("/customer", customerRoute);
app.use("/flight", flightRoute);
app.use("/planeModel", planeModelRoute);
app.use("/seatPosition", seatPositionRoute);
app.use("/ticket", ticketRoute);
app.use("/hotel", hotelRoute);
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "/views/invalidpage.html"));
});

const toIsoString = date => {
    let tzo = -date.getTimezoneOffset(),
        pad = num => {
            return (num < 10 ? '0' : '') + num;
        };
  
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes());
}
const amadeus = new Amadeus({
    clientId: "GpKk6tHJc33cfhxvPLktp1viSwpJa56B",
    clientSecret: "pAPfloCr1XaA0toB"
});


db.sequelize.sync().then(async () => {

    // AMADEUS

    // FLIGHTSTATS
    
    // auto-populate planeModels
    let options;
    await db.planeModel.count().then(async numPlaneModels => {
        if (numPlaneModels === 0) {
            options = {
                method: "GET",
                url: "https://api.flightstats.com/flex/equipment/rest/v1/json/all",
                headers: {
                    appId: "fd6db579",
                    appKey: "3b61de257c2e01cb9c3d3442ac673361",
                },
            }
            try {
                const aircraft = await axios.request(options);
                const { equipment } = aircraft.data;
                equipment.forEach(async planeModel => {
                    await db.planeModel.create({
                        iata: planeModel.iata,
                        modelName: planeModel.name,
                    });
                })
            } catch (err) {
                console.log(err);
            }
        }
    });
    
    options = {
        method: "GET",
        url: "https://api.flightstats.com/flex/schedules/rest/v1/json/from/JFK/departing/2023/4/28/13",
        headers: {
            appId: "fd6db579",
            appKey: "3b61de257c2e01cb9c3d3442ac673361",
        },
    };
    try {
        const flights = await axios.request(options);
        const { scheduledFlights } = flights.data;
        let departure, arrival, modelId;
        await scheduledFlights.forEach(async f => {
            departure = new Date(f.departureTime);
            arrival = new Date(f.arrivalTime);
            await db.flight.create({
                sourceAirport: f.departureAirportFsCode,
                destinationAirport: f.arrivalAirportFsCode,
                departureTime: departure,
                arrivalTime: arrival,
                duration: (arrival - departure)/(1000*60),
                airline: f.carrierFsCode,
                flightNumber: f.flightNumber,
                planeModelId: f.flightEquipmentIataCode,
            });
        });
        console.log("Finished populating database!");
    } catch (err) {
        console.log(err);
    }

    // AERODATABOX
    // query aerodatabox for flights flying to/from JFK over the next 11 hours
    // let dStart = new Date();
    // let dEnd = new Date();
    // dEnd.setHours(dStart.getHours() + 11);
    // dStart = toIsoString(dStart);
    // dEnd = toIsoString(dEnd);
    // const options = {
    //     method: 'GET',
    //     url: 'https://aerodatabox.p.rapidapi.com/flights/airports/iata/JFK/' + dStart + '/' + dEnd,
    //     params: {
    //         withCancelled: 'false',
    //         withCodeshared: 'false',
    //         withCargo: 'false',
    //         withPrivate: 'false',
    //         withLocation: 'false'
    //     },
    //     headers: {
    //         'content-type': 'application/octet-stream',
    //         'X-RapidAPI-Key': 'b6bd7f3f44mshc9228f8f9eb4c25p138c47jsn9181c49ffc94',
    //         'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    //     }
    // };
    // try {
    //     const res = await axios.request(options);
    //     const { departures, arrivals } = res.data;
    //     departures.forEach(async flight => {
    //         if (flight.movement.airport.iata !== undefined) {
    //             await db.flight.create({
    //                 sourceAirport: "JFK",
    //                 destinationAirport: flight.movement.airport.iata,
    //                 departureTime: flight.movement.airport.scheduledTimeUtc,
    //                 arrivalTime: ,
    //                 duration: ,
    //                 airline: ,
    //                 basePrice: 0,
    //                 numSold: 0
    //             })
    //         }
    //     });
    // } catch (err) {
    //     console.error(err);
    // }


    // SKELETON FOR CREATING FLIGHTS
    // await db.flight.create({
    //     sourceAirport: ,
    //     destinationAirport: ,
    //     departureTime: ,
    //     arrivalTime: ,
    //     duration: ,
    //     airline: ,
    //     basePrice: ,
    //     numSold: ,
    // })
    
    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
    });

    /*
    // manually seeding database
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
    */

}).catch(err => {
    console.log("Could not start database:", err);
});