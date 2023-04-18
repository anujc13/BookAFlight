const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const msg = {
    to: 'anujc2002@gmail.com', // Change to your recipient
    from: 'udayan19.rai@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
