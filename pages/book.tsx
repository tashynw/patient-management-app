import dayjs from "dayjs";
import { unstable_getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/navbar";
import { UserType } from "../types";
import { createAppointment, getAllDoctors } from "../utils/apiService";
import { authOptions } from "./api/auth/[...nextauth]";

interface BookPageProps {
  doctors: UserType[];
  pageSession: UserType;
}

export default function BookAppointment({
  pageSession,
  doctors,
}: BookPageProps) {
  const router = useRouter();
  const [doctor, setDoctor] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    await createAppointment({
      patientId: pageSession?.userId,
      date,
      time,
      description,
      doctorId: doctor,
    });
    setIsLoading(false);
    toast.success("Appointment booked successfully");
    router.push("/");
  }

  return (
    <>
      <Navbar pageSession={pageSession} />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>Book Appointment</h2>
        </div>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor</label>
            <select
              className="form-control mt-2"
              onChange={(e) => setDoctor(e.target.value)}
            >
              <option selected>Select Doctor</option>
              {doctors?.map((doctor: UserType) => (
                <option value={doctor?.userId} key={doctor?.userId}>
                  Dr. {`${doctor?.firstName} ${doctor?.lastName}`}
                </option>
              ))}
            </select>
          </div>
          <br />
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control mt-2"
              placeholder="Enter Date"
              required
              min={dayjs().format("YYYY-MM-DD")}
              max={dayjs().add(1, "month").format("YYYY-MM-DD")}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              className="form-control mt-2"
              required
              min="08:00"
              max="18:00"
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control mt-3"
              required
              style={{ height: "100px" }}
              onChange={(e) => setDescription(e.target.value)}
              minLength={30}
            ></textarea>
          </div>
          <br />
          <br />
          <button type="submit" className="btn btn-primary btn-lg text-white">
            Submit{" "}
            {isLoading && (
              <div
                className="spinner-border text-white spinner-border-sm"
                role="status"
              ></div>
            )}
          </button>
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

  if (!session || session?.role == "Doctor") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const doctors = await getAllDoctors();
  return {
    props: {
      pageSession: JSON.parse(JSON.stringify(session)),
      doctors: JSON.parse(JSON.stringify(doctors)),
    },
  };
}
