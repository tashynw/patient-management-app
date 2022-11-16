import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../utils/dbConnect";
import { v4 as uuidv4 } from "uuid";
import User from "../../../../models/User";
import { UserType } from "../../../../types";
import { hash } from "bcrypt"

type Data = {
  name?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    ipAddress
  }: UserType = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !role ||
    !ipAddress
  )
    return res.status(400).json({ message: "Invalid request body" });

  await dbConnect();
  //generate a user id
  const userId: string = uuidv4();

  //hash password
  const hashedPassword: string = await hash(password,10);;
  try {
    await User.create({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      ipAddress,
      age: 0,
      phoneNumber: "",
      address: "",
    });
    res.status(200).json({ message: "User successfully created" });
  } catch (e) {
    console.error(`Create User Error: ${e}`);
    res.status(400).json({ message: "Error creating User" });
  }
}
