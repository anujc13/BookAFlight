const { customer } = require("../models");
const { booking } = require("../models");
const { ticket } = require("../models");

// reserve booking - must be logged in
exports.reserve = async (req, res) => {

    const { ticketId } = req.body;
    let totalPrice = 0;

    // find tickets with matching ids
    await ticket.findAll({ where: { "id": ticketId } }).then(async match => {
        //check if all tickets exist and are unclaimed
        if (match.length !== ticketId.length || // not all tickets exist
            match.map(x => x.dataValues.purchased).reduce((a, b) => a + b, 0) > 0) // some tickets purchased
            return res.status(400).json({ error: "Ticket(s) unavailable!"});
        
        // calculate total price    
        totalPrice = match.map(x => x.dataValues.price).reduce((a, b) => a + b, 0);
        
        // create booking
        booking.create({
            customerId: req.user.id,
            price: totalPrice,
            reservationStatus: 1,
        }).then(async newBooking => {
            console.log(newBooking);
            await ticketId.forEach(async t => {
                
                // update corresponding tickets with bookingId and mark as purchased
                await ticket.update({ bookingId: newBooking.id, purchased: true }, { where: { id: t } });

            });
            return res.status(200).json("Ticket(s) successfully reserved!");
        });

    });
    
};
/*
// confirm booking
exports.confirm = async (req, res) => {

};

// cancel booking
exports.cancel = async (req, res) => {

};
*/