import type { NextApiRequest, NextApiResponse } from "next";
import Appointment from "../../../../models/Appointment";
import { AppointmentFetchQueries, AppointmentType } from "../../../../types";
import dbConnect from "../../../../utils/dbConnect";

type Data = {
  message?: string;
  body?: AppointmentType[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { patientId, query } = req.body;
  await dbConnect();

  try {
    let appointments;
    if (query) {
      appointments = await Appointment.find({
        patientId,
        appointmentStatus: AppointmentFetchQueries[query],
      }).exec();
    } else {
      appointments = await Appointment.find({ patientId }).exec();
    }

    if (!appointments)
      return res.status(400).json({ message: "Appointments not found" });

    return res.status(200).json({ body: appointments });
  } catch (e) {
    console.log(`Error get appointment: ${e}`);
    return res.status(400).json({ message: "Get appointment failed" });
  }
}
