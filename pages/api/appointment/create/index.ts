import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { sendAppointmentRequestEmail } from "../../../../emails/appointment_request_email/appointmentRequestEmail";
import { sendDoctorRequestEmail } from "../../../../emails/doctor_request_email/doctorRequestEmail";
import Appointment from "../../../../models/Appointment";
import User from "../../../../models/User";
import { AppointmentType, UserType } from "../../../../types";
import dbConnect from "../../../../utils/dbConnect";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    doctorId,
    patientId,
    date,
    time,
    description,
    appointmentStatus,
  }: AppointmentType = req.body;
  if (
    !doctorId ||
    !patientId ||
    !date ||
    !description ||
    !appointmentStatus ||
    !time
  )
    return res.status(400).json({ message: "Invalid request body" });

  await dbConnect();
  //generate an appointment id
  const appointmentId = uuidv4();

  try {
    await Appointment.create({
      appointmentId,
      doctorId,
      patientId,
      date,
      description,
      time,
      appointmentStatus,
    });
    //sending request emails
    const patient: UserType = await User.findOne({ userId: patientId }).exec();
    const doctor: UserType = await User.findOne({ userId: doctorId }).exec();
    await sendAppointmentRequestEmail(
      patient?.email,
      patient?.firstName,
      `${doctor?.firstName} ${doctor?.lastName}`,
      dayjs(new Date(date)).format("MMMM D, YYYY"),
      dayjs(time, "HH:mm").format("h:mm a")
    );
    await sendDoctorRequestEmail(
      doctor?.email,
      doctor?.lastName,
      `${patient?.firstName} ${patient?.lastName}`,
      dayjs(new Date(date)).format("MMMM D, YYYY"),
      dayjs(time, "HH:mm").format("h:mm a"),
      description
    );

    res.status(200).json({ message: "Appointment successfully created" });
  } catch (e) {
    console.log(`Create Appointment Error: ${e}`);
    res.status(400).json({ message: "Error creating Appointment" });
  }
}
