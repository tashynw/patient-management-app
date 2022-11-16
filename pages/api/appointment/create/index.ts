import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import Appointment from "../../../../models/Appointment";
import { AppointmentType } from "../../../../types";
import dbConnect from "../../../../utils/dbConnect";

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
  if (!doctorId || !patientId || !date || !description || !appointmentStatus || !time)
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
    res.status(200).json({ message: "Appointment successfully created" });
  } catch (e) {
    console.log(`Create Appointment Error: ${e}`);
    res.status(400).json({ message: "Error creating Appointment" });
  }
}
