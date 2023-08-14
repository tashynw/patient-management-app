import { compare } from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../models/User";
import { UserType } from "../../../../types";
import dbConnect from "../../../../utils/dbConnect";

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
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Invalid request body" });

  try {
    const user: UserType = await User.findOne({ email }).exec();
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    user.password = "";
    return res.status(200).json({ body: user });
  } catch (e) {
    console.log(`Error login: ${e}`);
    return res.status(400).json({ message: "Login failed" });
  }
}
