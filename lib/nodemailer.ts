import nodemailer from "nodemailer";

const email = process.env.EMAILSENDER;
const pass = process.env.TOKENEMAILSENDER;

export const transporter = nodemailer.createTransport({
  service: "Godaddy",
  host: "smtpout.secureserver.net",
  port: 465,
  secure: false,
  debug: true,
  tls: {
    ciphers:'SSLv3'
},
  auth: {
    user: email,
    pass,
  },
});
// export const transporter = nodemailer.createTransport({
//   service: "Outlook365",
//   port: 587,
//   secure: true,
//   debug: true,
//   auth: {
//     user: email,
//     pass,
//   },
// });
// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: email,
//     pass,
//   },
// });

export const mailOptions = {
  from: email,
};