require("dotenv").config();
const nodemailer = require("nodemailer");
const env = process.env;
const hbs = require("nodemailer-express-handlebars");

// Create and export the nodemailer transporter
let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: env.BREVO_EMAIL,
    pass: env.BREVO_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      layoutsDir: "templates/",
      defaultLayout: false,
      partialsDir: "templates/",
    },
    viewPath: "templates/",
    extName: ".hbs",
  }),
);

module.exports = transporter;
