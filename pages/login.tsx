import Image from "next/image";
import React from "react";
import NavBar from "../components/navbar";

const LoginPage = () => {
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
              <button className="btn btn-primary btn-lg text-white">
                Set appointment today
              </button>
            </div>

            <div className="w-30 p-5 bg-white rounded-3">
              <h1 className="text-center">Login</h1>
              <br />
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control mt-2"
                  placeholder="Enter email"
                />
              </div>
              <br />
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-2"
                  placeholder="Enter password"
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
              <br />
              <div className="text-center">
                <p>
                  <strong>Don't have an account? Sign Up</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
