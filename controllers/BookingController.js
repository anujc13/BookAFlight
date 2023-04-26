const { customer } = require("../models");
const { flight } = require("../models");
const { booking } = require("../models");
const { ticket } = require("../models");
const stripe = require("stripe")("sk_test_51MpHOVFvgDsA0B2SrxeC2mgQXnVGQEF4bfGNUURf54qVdCdHCA0dotnOQOd6ig5DGi1hJlFsoVuhPbm7BrvU7mCb00uZC3KmXW");
const client = require('twilio')('ACe442c2772b48760a1f1ae5d9f37a6cc8', '85e1a23f7430ab54c9cbb47c2c9c6a00');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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")

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
    const { customerId}  = req.body;
    const {flightId } = req.body;

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
            await booking.findOne({ where: { "id": bookingId } }).then(async bookingMatch => {
                await customer.findOne({ where: { "id": bookingMatch.customerId } }).then(async customerMatch => {
                    const phoneNumber = customerMatch.phone;
                    const email = customerMatch.email;
                    const message = "Booking Confirmed! Thank you for booking with Book-A-Flight";
                    try{
                    //Confirmation email using twilio sendgrid
                    const msg = {
                     to: email, // Change to your recipient
                    from: 'udayan19.rai@gmail.com', // Change to your verified sender
                    subject: 'BookAFlight account creation successful',
                    text: 'Your Booking was confirmed',
                    html: '<strong>Enjoy your travelling experience!</strong>',
        }
                sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
              console.error(error)
            })
                    client.messages.create({
                        to: phoneNumber,
                        from: '+18442948043',
                        body: message}).then((message) => {
                            console.log('Message sent:', message.sid);
                        }).catch((err)=>{
                            console.error('Error sending message:', err);
                        });
                    } catch(e) {
                        console.log(e);
                        //return res.status(500)
                    }
                })
            })
            return res.json({ url: session.url });
        } catch (e) {
            res.status(500).json({ error: e });
        }
        
        // await customer.findAll({where:{"id": customerId}}).then(async match => {
        //     try{
        //         const phoneNumber = bookingId.phone;
        //         await flight.findAll({where: {"id": flightId}}).then(async match =>{
        //             try{
        //             const departure = flight.sourceAirport;
        //             const destination = flight.destinationAirport;
        //          g   const deptTime = flight.departureTime;
        //             const airline = flight.airline;
        //             const message = "Your flight was successfully booked! Leaving "+ departure + " at " + deptTime + " on "+ airline +" to "+destination;
        //             client.messages.create({
        //                 to: phoneNumber,
        //                 from: '+18442948043',
        //                 body: message}).then((message) => {
        //                     console.log('Message sent:', message.sid);
        //                 }).catch((err)=>{
        //                     console.error('Error sending message:', err);
        //                 });
        //             } catch(e) {
        //                 console.log(e);
        //                 //return res.status(500)
        //             }
        //             })
        //         }
        //     catch(e) {
        //         console.log(e);
        //         //return res.status(500).json({error:e});
        //     }
    }  
//    });

//});

/*
// cancel booking
exports.cancel = async (req, res) => {

};
*/)
}