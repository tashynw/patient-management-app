import type { NextApiRequest, NextApiResponse } from "next";
import Appointment from "../../../models/Appointment";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  await dbConnect();
  try {
    const appointments = await Appointment.find({}).exec();
    for (const appointment of appointments) {
      const patientInfo = await User.findOne({
        userId: appointment.patientId,
      }).exec();
      const doctorInfo = await User.findOne({
        userId: appointment.doctorId,
      }).exec();

      appointment.patientId = `${patientInfo.firstName} ${patientInfo.lastName}`;
      appointment.doctorId = `${doctorInfo.firstName} ${doctorInfo.lastName}`;
    }

    return res.status(200).json(appointments);
  } catch (e) {
    console.log(`Error get appointment: ${e}`);
    return res.status(400).json({ message: "Failed to get appointments" });
  }
}
