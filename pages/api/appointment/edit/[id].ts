import type { NextApiRequest, NextApiResponse } from "next";
import Appointment from "../../../../models/Appointment";
import dbConnect from "../../../../utils/dbConnect";

type Data = {
  name?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();
  const { id } = req.query;
  const { date, description, appointmentStatus } = req.body;

  const appointment = await Appointment.findOne({ appointmentId: id }).exec();
  if (!appointment)
    return res.status(400).json({ message: "This appointment does not exist" });

  try {
    const response = await Appointment.updateOne(
      { appointmentId: id },
      { date, description, appointmentStatus }
    );
    if (!response.acknowledged)
      return res.status(400).json({ message: "Error editing appointment" });
    return res.status(200).json({ message: "Appointment edited successfully" });
  } catch (e) {
    console.log(`Delete appointment Error: ${e}`);
    return res.status(400).json({ message: "Error editing appointment" });
  }
}
