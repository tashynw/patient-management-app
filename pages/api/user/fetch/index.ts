import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../models/User";
import { UserType } from "../../../../types";
import dbConnect from "../../../../utils/dbConnect";

type Data = {
  message?: string;
  body?: UserType[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: "Invalid request body" });
  await dbConnect();

  try {
    if (query == "Doctor" || query == "Patient") {
      const users = await User.find({ role: query }).exec();
      if (!users) return res.status(400).json({ message: "Users not found" });
      users.forEach((user) => (user.password = undefined));
      return res.status(200).json({ body: users });
    }

    const users = await User.find({ firstName: query, role: "Patient" }).exec();
    if (!users) return res.status(400).json({ message: "Users not found" });
    users.forEach((user) => (user.password = undefined));
    return res.status(200).json({ body: users });
  } catch (e) {
    console.log(`Error user query: ${e}`);
    return res.status(400).json({ message: "User query failed" });
  }
}
