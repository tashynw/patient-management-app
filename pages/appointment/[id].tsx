import { unstable_getServerSession } from "next-auth";
import React from "react";
import NavBar from "../../components/navbar";
import { AppointmentType, UserType } from "../../types";
import { getAppointment, getUser } from "../../utils/apiService";
import { authOptions } from "../api/auth/[...nextauth]";

interface ArticlePageProps {
  appointment: AppointmentType;
  pageSession: UserType;
}

export default function Appointment(props: ArticlePageProps) {
  return (
    <>
      <NavBar pageSession={props?.pageSession}/>
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
              value={`Dr. ${props?.appointment?.doctorId}`}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control mt-2"
              disabled
              value={props?.appointment?.date}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              className="form-control mt-2"
              disabled
              value={props?.appointment?.time}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control mt-3"
              style={{ height: "100px" }}
              disabled
              value={props?.appointment?.description}
            ></textarea>
          </div>
          <br />
          <p className="text-primary">{props?.appointment?.appointmentStatus}</p>
        </form>
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

  if (!session || session?.role=="Doctor") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const id = context.params.id;
  const appointment: AppointmentType = await getAppointment(id);

  if(!appointment){
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const doctor = await getUser(appointment.doctorId);
  appointment.doctorId = doctor?.lastName;
  
  return {
    props: {
      pageSession: JSON.parse(JSON.stringify(session)),
      appointment: JSON.parse(JSON.stringify(appointment))
    },
  };
}
