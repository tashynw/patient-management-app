import type { NextApiRequest, NextApiResponse } from "next";
import Appointment from "../../../models/Appointment";
import { AppointmentType } from "../../../types";
import dbConnect from "../../../utils/dbConnect";

type Data = {
  message?: string;
  body?: AppointmentType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  await dbConnect();
  try {
    const appointment = await Appointment.findOne({ appointmentId: id }).exec();
    if (!appointment)
      return res.status(400).json({ message: "Appointment not found" });
    return res.status(200).json({ body: appointment });
  } catch (e) {
    console.log(`Error get appointment: ${e}`);
    return res.status(400).json({ message: "Get appointment failed" });
  }
}
