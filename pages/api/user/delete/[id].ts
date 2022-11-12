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

  const user = await User.findOne({ userId: id }).exec();
  if (!user)
    return res.status(400).json({ message: "This user does not exist" });

  try {
    const response = await User.deleteOne({ userId: id });
    if (!response.deletedCount)
      return res.status(400).json({ message: "Error deleting user" });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    console.log(`Delete user Error: ${e}`);
    return res.status(400).json({ message: "Error deleting user" });
  }
}
