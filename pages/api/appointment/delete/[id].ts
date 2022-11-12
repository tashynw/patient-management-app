import type { NextApiRequest, NextApiResponse } from "next";
import Appointment from "../../../../models/Appointment";
import dbConnect from "../../../../utils/dbConnect";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  await dbConnect();

  const appointment = await Appointment.findOne({ appointmentId: id }).exec();
  if (!appointment)
    return res.status(400).json({ message: "This appointment does not exist" });

  try {
    const response = await Appointment.deleteOne({ appointmentId: id });
    if (!response.deletedCount)
      return res.status(400).json({ message: "Error deleting appointment" });
    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (e) {
    console.log(`Delete appointment Error: ${e}`);
    return res.status(400).json({ message: "Error deleting appointment" });
  }
}
