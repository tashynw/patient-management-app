import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/User";
import { UserType } from "../../../types";
import dbConnect from "../../../utils/dbConnect";

type Data = {
  name?: string;
  message?: string;
  body?: UserType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();
  const { id } = req.query;

  try {
    const user: any = await User.findOne({ userId: id }).exec();
    if (!user) return res.status(400).json({ message: "User not found" });
    user.password = undefined;
    return res.status(200).json({ body: user });
  } catch (e) {
    console.log(`Error get user: ${e}`);
    return res.status(400).json({ message: "Get user failed" });
  }
}
