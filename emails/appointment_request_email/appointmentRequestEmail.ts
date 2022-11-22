import nodemailer from "nodemailer";
import fs from "fs";
import Handlebars from "handlebars";

const smtpUser: string = process.env.SMTP_USER || "";
const smtpPassword: string = process.env.SMTP_PASSWORD || "";
if (!smtpUser || !smtpPassword) throw new Error("SMTP envs not set!");

export async function sendAppointmentRequestEmail(
  email: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "SendinBlue",
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const htmlTemplate = Handlebars.compile(
      fs.readFileSync("./emails/appointment_request_email/email.html", "utf-8")
    );
    const textTemplate = Handlebars.compile(
      fs.readFileSync("./emails/appointment_request_email/email.txt", "utf-8")
    );

    const templateData = {
      name: patientName,
      doctorName,
      date,
      time,
    };
    const finalHtml = htmlTemplate(templateData);
    const finalText = textTemplate(templateData);

    await transporter.sendMail({
      from: `"Patient Appointment App" <admin@patientappointment.com>`,
      to: [email],
      subject: "Appointment Requested",
      text: finalText,
      html: finalHtml,
    });
  } catch (e) {
    console.error(`Error sendWelcomeEmail(): ${e}`);
  }
}
