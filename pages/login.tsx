import { unstable_getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import NavBar from "../components/navbar";
import { UserType } from "../types";
import { getUser, loginUser } from "../utils/apiService";
import { authOptions } from "./api/auth/[...nextauth]";

interface LoginPageProps {
  pageSession: UserType;
}

export default function LoginPage(props: LoginPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [doctorPassword, setDoctorPassword] = useState<string>("");

  async function handleLoginForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let loginStatus;
    if(!isDoctor){
      loginStatus = await loginUser({ email, password });
      if(!loginStatus || loginStatus?.role=="Doctor") return setLoginFailed(true);

      loginStatus = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!loginStatus?.ok) return setLoginFailed(true);
      return router.push("/");
    }
    if (doctorPassword!="2jmX9Z^3TWl2") return setLoginFailed(true);
    loginStatus = await loginUser({ email, password });
    if(!loginStatus || loginStatus?.role!="Doctor") return setLoginFailed(true);

    loginStatus = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!loginStatus?.ok) return setLoginFailed(true);
    router.push("/doctor");    
  }

  return (
    <>
      <div
        className="bg-image"
        style={{
          backgroundImage: `url("/static/background.jpg")`,
          height: "100vh",
        }}
      >
        <NavBar pageSession={props?.pageSession}/>
        <div
          className="container"
          style={{
            height: "88vh",
            backgroundImage: "../public/static/login-background.jpg",
          }}
        >
          <div
            className="h-100 d-flex justify-content-center align-items-center"
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

            <div className="w-30 p-4 bg-white rounded-3">
              <h4 className="text-center">Login</h4>
              <br />
              <form onSubmit={handleLoginForm}>
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
                    className="form-control mt-2"
                    placeholder="Enter password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                    Submit
                  </button>
                </div>
              </form>
              <br />
              <div className="text-center">
                <Link
                  href="/signup"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <strong>Don't have an account? Sign Up</strong>
                </Link>
                {loginFailed && (
                  <p className="text-danger text-center">Login Failed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    const redirectDestination = (session?.role == "Doctor") ? "/doctor" : "/";
    return {
      redirect: {
        destination: redirectDestination,
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
