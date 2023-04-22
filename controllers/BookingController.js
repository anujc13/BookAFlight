const { customer } = require("../models");
const { booking } = require("../models");
const { ticket } = require("../models");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

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

// booking checkout
exports.checkout = async (req, res) => {
    const { bookingId } = req.body;

    // find corresponding booking
    await ticket.findAll({ where: { "bookingId": bookingId } }).then(async match => {
        
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: match.map(t => {
                    return {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Ticket",
                            },
                            unit_amount: t.dataValues.price * 100, // price in cents
                        },
                        quantity: 1,
                    }
                }),
                success_url: "http://localhost:3000",
                cancel_url: "http://localhost:3000",
            });
            res.json({ url: session.url });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });
    
};

/*
// cancel booking
exports.cancel = async (req, res) => {

};
*/