import { CreateUserInput, LoginUserInput, UserType } from "../types";

const HOST_NAME: string = "http://localhost:3000";

export async function createUser(input: CreateUserInput): Promise<boolean> {
  try {
    const requestBody = { ...input, role: "Patient" };
    const request = await fetch(`${HOST_NAME}/api/user/signup`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });
    return request.ok;
  } catch (e) {
    console.log(`Error createUser() ${e}`);
    throw new Error(`Error in createUser()`);
  }
}

export async function loginUser(input: LoginUserInput): Promise<UserType> {
  try {
    const request = await fetch(`${HOST_NAME}/api/user/login`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
    });
    const user: UserType = await request.json();
    return user;
  } catch (e) {
    console.log(`Error loginUser() ${e}`);
    throw new Error(`Error in loginUser()`);
  }
}
