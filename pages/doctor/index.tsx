import Link from "next/link";
import React, { useState } from "react";
import NavBar from "../../components/navbar";
import { AppointmentType, UserType } from "../../types";
import {
  getAllAppointments,
  getAllPatients,
  getPatientsWithFirstName,
} from "../../utils/apiService";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

interface DoctorPageProps {
  pageSession: UserType;
}

const DoctorPage = (props: DoctorPageProps) => {
  const [firstName, setFirstName] = useState<string>("");
  const [patients, setPatients] = useState<
    (UserType & { appointments?: AppointmentType[] })[]
  >([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const foundPatients: any = await getPatientsWithFirstName(firstName);
    for (let patient of foundPatients) {
      const appointments = await getAllAppointments(patient?.userId);
      patient["appointments"] = appointments;
    }
    setPatients(foundPatients);
  }

  async function loadAllPatients() {
    const allPatients: any = await getAllPatients();
    for (let patient of allPatients) {
      const appointments = await getAllAppointments(patient?.userId);
      patient["appointments"] = appointments;
    }
    setPatients(allPatients);
  }

  return (
    <>
      <NavBar pageSession={props?.pageSession} />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>Doctor Management</h2>
        </div>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group w-50">
            <div
              className="input-group d-flex align-items-center"
              style={{ gap: "10px" }}
            >
              <label>Enter Patient's First Name</label>
              <input
                type="search"
                className="form-control"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <button className="btn btn-primary text-white w-15">
                Search
              </button>
            </div>
          </div>
          <br />
        </form>
        <button
          className="btn btn-primary text-white"
          onClick={loadAllPatients}
        >
          View All Patients
        </button>
        <br />
        <br />
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">FirstName</th>
                <th scope="col">LastName</th>
                <th scope="col">Age</th>
                <th scope="col">Number</th>
                <th scope="col">Address</th>
                <th scope="col">Appointments</th>
              </tr>
            </thead>
            <tbody>
              {patients?.map((patient) => (
                <tr key={patient?.userId}>
                  <td>{patient?.firstName}</td>
                  <td>{patient?.lastName}</td>
                  <td>{!patient?.age ? "" : patient?.age}</td>
                  <td>{patient?.phoneNumber}</td>
                  <td>{patient?.address}</td>
                  <td>
                    {patient?.appointments?.map((appointment, i) => (
                      <Link
                        href={`/appointment/${appointment?.appointmentId}`}
                        key={appointment?.appointmentId}
                      >
                        {`Appointment ${i + 1}\n\n`}
                      </Link>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DoctorPage;

export async function getServerSideProps(context: any) {
  const session: any = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || session?.role != "Doctor") {
    return {
      redirect: {
        destination: "/login",
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
