const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

sgMail.setApiKey(SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: "rabiajamil251@gmail.com",
        subject: "Welcome to Profile-WishList Application",
        text: `Hi ${name} This is the welcome email from us to you!`,
        
        //  html: "<strong>sgMail can also send HTML formatted emails</strong>"
    }
    
    sgMail.send(msg)
}

const sendGoodByeEmail = (email, name) => {
    const msg = {
        to: email,
        from: "rabiajamil251@gmail.com",
        subject: "Bye from Profile-WishList Application",
        text: `Hi ${name} Hope to see you soon!`,
        
        //  html: "<strong>sgMail can also send HTML formatted emails</strong>"
    }
    
    sgMail.send(msg)
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}
