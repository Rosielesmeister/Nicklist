import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Configure the transporter using your email credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // or another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
export const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  await transporter.sendMail(mailOptions);
};

import { sendEmail } from "../utilitys/email.js";
