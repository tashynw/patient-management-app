import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AppointmentType } from "../types/index";
import {
  getAcceptedAppointments,
  getPendingAppointments,
  getRejectedAppointments,
  getUser,
} from "../utils/apiService";
import Cards from "./cards";

const CardsContainer = () => {
  const [acceptedAppointments, setAcceptedAppointments] =
    useState<AppointmentType[]>();
  const [pendingAppointments, setPendingAppointments] =
    useState<AppointmentType[]>();
  const [rejectedAppointments, setRejectedAppointments] =
    useState<AppointmentType[]>();

  async function getCards() {
    const user: any = await getSession();

    const acceptedCards = await getAcceptedAppointments(user?.userId);
    for (let appointment of acceptedCards) {
      const doctor = await getUser(appointment.doctorId);
      appointment.doctorId = doctor?.lastName;
    }
    setAcceptedAppointments(acceptedCards);

    const pendingCards = await getPendingAppointments(user?.userId);
    for (let appointment of pendingCards) {
      const doctor = await getUser(appointment.doctorId);
      appointment.doctorId = doctor?.lastName;
    }
    setPendingAppointments(pendingCards);

    const rejectedCards = await getRejectedAppointments(user?.userId);
    for (let appointment of rejectedCards) {
      const doctor = await getUser(appointment.doctorId);
      appointment.doctorId = doctor?.lastName;
    }
    setRejectedAppointments(rejectedCards);
  }

  useEffect(() => {
    getCards();
  }, []);

  function AcceptedAppointments() {
    return acceptedAppointments?.length ? (
      <>
        <h5 className="mt-5 text-muted">Accepted Appointments</h5>
        <Cards cards={acceptedAppointments} />
      </>
    ) : null;
  }

  function PendingAppointments() {
    return pendingAppointments?.length ? (
      <>
        <h5 className="mt-5 text-muted">Pending Appointments</h5>
        <Cards cards={pendingAppointments} />
      </>
    ) : null;
  }

  function RejectedAppointments() {
    return rejectedAppointments?.length ? (
      <>
        <h5 className="mt-5 text-muted">Rejected Appointments</h5>
        <Cards cards={rejectedAppointments} />
      </>
    ) : null;
  }

  return (
    <>
      <AcceptedAppointments />
      <PendingAppointments />
      <RejectedAppointments />
    </>
  );
};

export default CardsContainer;
