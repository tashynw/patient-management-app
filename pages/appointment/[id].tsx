import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import NavBar from "../../components/navbar";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Appointment() {
  const router = useRouter();
  const data = router.query;
  return (
    <>
      <NavBar />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>Appointment</h2>
        </div>
        <br />
        <br />
        <form>
          <div className="form-group">
            <label>Doctor</label>
            <input
              type="text"
              className="form-control mt-2"
              disabled
              value={`Dr. ${data?.doctorId}`}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control mt-2"
              disabled
              value={data?.date}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              className="form-control mt-2"
              disabled
              value={data?.time}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control mt-3"
              style={{ height: "100px" }}
              disabled
              value={data?.description}
            ></textarea>
          </div>
          <br />
          <p className="text-primary">{data?.appointmentStatus}</p>
        </form>
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
