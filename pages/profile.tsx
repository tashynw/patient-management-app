import { unstable_getServerSession } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/navbar";
import { UserType } from "../types";
import { deleteUser, updateUser } from "../utils/apiService";
import { authOptions } from "./api/auth/[...nextauth]";

export default function ProfilePage() {
  const router = useRouter();
  const user = useRef<UserType>();
  const [age, setAge] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(true);

  async function getUserInformation() {
    const userInformation: any = await getSession();
    user.current = userInformation;
    setAge(userInformation?.age);
    setPhoneNumber(userInformation?.phoneNumber);
    setAddress(userInformation?.address);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //validate
    if (user.current?.userId)
      await updateUser(
        user?.current?.userId,
        parseInt(age),
        phoneNumber,
        address
      );
    setDisable(true);
  }

  async function deleteUserFunction() {
    if (confirm("Are you sure you want to delete your account?")) {
      if (!user.current?.userId) return;
      const response = await deleteUser(user.current?.userId);
      if (!response) return;
      signOut();
      router.push("/login");
    }
  }

  useEffect(() => {
    getUserInformation();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>Profile</h2>
        </div>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group w-25">
            <div
              className="input-group d-flex align-items-center"
              style={{ gap: "10px" }}
            >
              <label>Age</label>
              <input
                type="number"
                min={10}
                max={100}
                className="form-control"
                disabled={disable}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>
          <br />
          <div className="form-group w-25">
            <div
              className="input-group d-flex align-items-center"
              style={{ gap: "10px" }}
            >
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                minLength={7}
                maxLength={15}
                disabled={disable}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <br />
          <br />
          <div className="form-group">
            <label>Address</label>
            <textarea
              className="form-control mt-3"
              required
              minLength={10}
              style={{ height: "80px" }}
              disabled={disable}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          <br />
          <br />
          {disable ? (
            <button
              className="btn btn-primary text-white"
              onClick={() => setDisable(false)}
            >
              Edit
            </button>
          ) : (
            <>
              <br />
              <button
                type="submit"
                className="btn btn-primary text-white"
                onClick={() => setDisable(false)}
              >
                Submit
              </button>
            </>
          )}
        </form>
        <br />
        <br />
        <h2 className="mt-5">Manage Profile</h2>
        <br />
        <button
          className="btn btn-danger btn-lg text-white"
          onClick={() => deleteUserFunction()}
        >
          Delete my account
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  };
}
