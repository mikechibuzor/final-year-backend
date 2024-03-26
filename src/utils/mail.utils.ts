import nodemailer from "nodemailer"
import { ISendMail, ISendVerificationMail } from "./interfaces/utils.interface"

require('dotenv').config()
const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
}

const send = async (params : ISendMail) => {
  try {
    const transporter = nodemailer.createTransport(config);
    const response = await transporter.sendMail({
      from: "Online Repo <chivusmar99@gmail.com>",
      to: params.to,
      subject: params.subject,
      html: params.html
    });
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const sendVerificationMail = async (params: ISendVerificationMail) => {
  try {
    const html = `
    <center>
    <div>
      <h2>Hi</h2>
      <p>Thank you for setting up an account with us</p>
      <p>One more step. Please, click on the link below to verify your account</p>
      <p><center>${params.magicLink}</center></div>
      <p>Note: This link is only valid for 10 minutes</p>
    </div>
    <p>Please ignore if you feel this is not for you</p>
    <p>Thanks</p>
    </center>
    `;

    await send({to: params.to, subject: "Account Verification", html});

  } catch (error) {
    throw error
  }
}