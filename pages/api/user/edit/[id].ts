import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../models/User";
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
  const { age, phoneNumber, address } = req.body;

  const user = await User.findOne({ userId: id }).exec();
  if (!user)
    return res.status(400).json({ message: "This user does not exist" });

  try {
    const response = await User.updateOne(
      { userId: id },
      { age, phoneNumber, address }
    );
    if (!response.acknowledged)
      return res.status(400).json({ message: "Error editing user" });
    return res.status(200).json({ message: "User edited successfully" });
  } catch (e) {
    console.log(`Delete user Error: ${e}`);
    return res.status(400).json({ message: "Error editing user" });
  }
}
