import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import NavBar from "../components/navbar";
import { createDoctor, createUser } from "../utils/apiService";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { UserType } from "../types";

interface SignUpPageProps {
  pageSession: UserType;
}

export default function SignUpPage(props: SignUpPageProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false);
  const [matchPasswordRegex, setMatchPasswordRegex] = useState<boolean>(true);
  const [signUpFailed, setSignUpFailed] = useState<boolean>(false);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [doctorPassword, setDoctorPassword] = useState<string>("");

  const getIpAddress = async (): Promise<string> => {
    const res = await fetch("https://geolocation-db.com/json/");
    const json = await res.json();
    return json.IPv4;
  };

  const handleSignUpForm = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (password != confirmPassword) return setPasswordMismatch(true);
      if (
        !new RegExp("^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").test(
          password
        )
      )
        return setMatchPasswordRegex(false);
      const ipAddress: string = await getIpAddress();
      if(isDoctor){
        if(doctorPassword!="2jmX9Z^3TWl2") return setSignUpFailed(true);
        await createDoctor({ firstName, lastName, email, password, ipAddress });
        const loginStatus = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (!loginStatus?.ok) return setSignUpFailed(true);
        return router.push("/");
      }
      await createUser({ firstName, lastName, email, password, ipAddress });
      const loginStatus = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!loginStatus?.ok) return setSignUpFailed(true);
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div
      className="bg-image"
      style={{
        backgroundImage: `url("/static/background.jpg")`,
        height: "100vh",
      }}
    >
      <NavBar pageSession={props?.pageSession}/>
      <div className="container" style={{ height: "88vh" }}>
        <div
          className="column h-100 d-flex justify-content-center align-items-center"
          style={{ gap: "100px" }}
        >
          <div className="w-85 p-3 intro-banner">
            <h1 className="text-white">Book Doctor Appointments</h1>
            <br />
            <h4 className="text-white">
              Our doctors are both certified and experienced in the medical
              field.
            </h4>
            <br />
            <button className="btn btn-primary btn-lg text-white rounded-5">
              Set Appointment today
            </button>
          </div>

          <div className="w-20 p-4 bg-white rounded-3">
            <h4 className="text-center">Sign Up</h4>
            <br />
            <form onSubmit={handleSignUpForm}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter First Name"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter Last Name"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control mt-2"
                  placeholder="Enter email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className={
                    matchPasswordRegex
                      ? "form-control mt-2"
                      : "form-control mt-2 is-invalid"
                  }
                  placeholder="Enter password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!matchPasswordRegex && (
                  <div className="invalid-feedback">
                    Minimum of eight characters, at least one letter, number and
                    special character.
                  </div>
                )}
              </div>
              <br />
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className={
                    !passwordMismatch
                      ? "form-control mt-2"
                      : "form-control mt-2 is-invalid"
                  }
                  placeholder="Confirm password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordMismatch && (
                  <div className="invalid-feedback">
                    The password does not match.
                  </div>
                )}
              </div>
              <br />
              {isDoctor && 
                <div className="form-group">
                  <label>Enter Doctor's code</label>
                  <input
                    type="password"
                    className="form-control mt-2"
                    placeholder="Enter password"
                    required
                    onChange={(e) => setDoctorPassword(e.target.value)}
                  />
                </div>
              }
              <br />
              <div className="form-check">
                <label className="form-check-label">
                  Are you a Doctor?
                  <input className="form-check-input" type="checkbox" checked={isDoctor} onChange={()=>setIsDoctor(!isDoctor)}/>
                </label>
              </div>
              <br />
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg text-white"
                >
                  Start Today!
                </button>
              </div>
            </form>
            <br />
            <div className="text-center">
              <Link
                href="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <strong>Already have an account? Login</strong>
              </Link>
              {signUpFailed && (
                <p className="text-danger text-center">SignUp Failed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      pageSession: JSON.parse(JSON.stringify(session)),
    },
  };
}
