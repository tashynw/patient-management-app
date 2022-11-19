import { unstable_getServerSession } from "next-auth";
import React, { useState } from "react";
import NavBar from "../../components/navbar";
import { AppointmentType, UserType } from "../../types";
import {
  getAppointment,
  getUser,
  updateAppointment,
} from "../../utils/apiService";
import { authOptions } from "../api/auth/[...nextauth]";

interface ArticlePageProps {
  appointment: AppointmentType;
  pageSession: UserType;
}

export default function Appointment(props: ArticlePageProps) {
  const [appointmentStatus, setAppointmentStatus] = useState<string>(
    props?.appointment?.appointmentStatus
  );
  const [status, setStatus] = useState<string>("Pending");

  async function changeStatus(e: any) {
    setStatus(e.target.value);
    const response = await updateAppointment(
      props?.appointment?.appointmentId,
      props?.appointment?.date,
      props?.appointment?.description,
      e.target.value
    );
    if (!response) return;
    setAppointmentStatus(e.target.value);
  }

  return (
    <>
      <NavBar pageSession={props?.pageSession} />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>Appointment</h2>
        </div>
        <br />
        <br />
        <form>
          <div className="form-group">
            {props?.pageSession?.role == "Patient" ? (
              <>
                <label>Doctor</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  disabled
                  value={`Dr. ${props?.appointment?.doctorId}`}
                />
              </>
            ) : (
              <>
                <label>Patient</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  disabled
                  value={`${props?.appointment?.patientId}`}
                />
              </>
            )}
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
          <p className="text-primary">{appointmentStatus}</p>
          {props?.pageSession?.role == "Doctor" &&
            appointmentStatus == "Pending" && (
              <div className="form-group">
                <label>Set Status</label>
                <select className="form-control mt-2" onChange={changeStatus}>
                  <option selected>Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
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

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const id = context.params.id;
  const appointment: AppointmentType = await getAppointment(id);

  if (!appointment) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (session?.role == "Patient") {
    const doctor = await getUser(appointment.doctorId);
    appointment.doctorId = doctor?.lastName;
  } else if (session?.role == "Doctor") {
    const patient = await getUser(appointment.patientId);
    appointment.patientId = `${patient?.firstName} ${patient?.lastName}`;
  }

  return {
    props: {
      pageSession: JSON.parse(JSON.stringify(session)),
      appointment: JSON.parse(JSON.stringify(appointment)),
    },
  };
}
