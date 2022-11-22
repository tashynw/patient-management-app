import nodemailer from "nodemailer";
import fs from "fs";
import Handlebars from "handlebars";

const smtpUser: string = process.env.SMTP_USER || "";
const smtpPassword: string = process.env.SMTP_PASSWORD || "";
if (!smtpUser || !smtpPassword) throw new Error("SMTP envs not set!");

export async function sendWelcomeEmail(email: string, firstName: string) {
  console.log(`Email: ${email}\nFirstName: ${firstName}`);
  try {
    const transporter = nodemailer.createTransport({
      service: "SendinBlue",
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const htmlTemplate = Handlebars.compile(
      fs.readFileSync("emails/welcome_email/email.html", "utf-8")
    );
    const textTemplate = Handlebars.compile(
      fs.readFileSync("emails/welcome_email/email.txt", "utf-8")
    );

    const templateData = {
      name: firstName,
    };
    const finalHtml = htmlTemplate(templateData);
    const finalText = textTemplate(templateData);

    await transporter.sendMail({
      from: `"Patient Appointment App" <admin@patientappointment.com>`,
      to: [email],
      subject: "Welcome to the Patient Appointment App",
      text: finalText,
      html: finalHtml,
    });
  } catch (e) {
    console.error(`Error sendWelcomeEmail(): ${e}`);
  }
}
