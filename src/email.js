const sgMail = require('@sendgrid/mail')

const SENDGRID_API_KEY = "SG.vKL1cQP-R0aj526hHwrhAg.Eu5u92wIZRwc5hZrwslNusucJ1wcOQnpjrmGPxQvuvw"

sgMail.setApiKey(SENDGRID_API_KEY)

const msg = {
    to: "rabiajamil251@gmail.com",
    from: "rabiajamil251@gmail.com",
    subject: "First test email",
    text: "Sending email using sgMail in Node JS!",
    html: "<strong>sgMail can also send HTML formatted emails</strong>"
}

sgMail.send(msg)