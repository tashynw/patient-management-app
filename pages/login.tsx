import { unstable_getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import NavBar from "../components/navbar";
import { authOptions } from "./api/auth/[...nextauth]";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);

  async function handleLoginForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loginStatus = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!loginStatus?.ok) return setLoginFailed(true);
    router.push("/");
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
        <NavBar />
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

            <div className="w-30 p-5 bg-white rounded-3">
              <h1 className="text-center">Login</h1>
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
      session: JSON.parse(JSON.stringify(session)),
    },
  };
}
