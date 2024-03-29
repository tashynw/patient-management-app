import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import Appointment from "../../../models/Appointment";
import { UserType } from "../../../types";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session: any = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Not signed in" });
    }

    const patientId = req.query.patientId;
    if (!patientId)
      return res.status(400).json({ message: "Invalid request body" });

    await dbConnect();

    const response: any = {
      acceptedCards: [],
      pendingCards: [],
      rejectedCards: [],
    };
    const appointments = await Appointment.find({
      patientId,
    }).exec();
    if (!appointments) return res.status(200).json(response);

    for (const appointment of appointments) {
      const doctor: UserType = await User.findOne({
        userId: appointment.doctorId,
      }).exec();
      appointment.doctorId = `${doctor?.firstName} ${doctor?.lastName}`;

      response[`${appointment.appointmentStatus.toLowerCase()}Cards`].push(
        appointment
      );
    }

    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "Get appointment failed" });
  }
}
