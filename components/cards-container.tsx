import React from "react";
import { AppointmentType } from "../types";
import Cards from "./cards";

interface CardsContainerProps {
  acceptedCards: AppointmentType[];
  pendingCards: AppointmentType[];
  rejectedCards: AppointmentType[];
}

const CardsContainer = (props: CardsContainerProps) => {
  function AcceptedAppointments() {
    return props?.acceptedCards?.length ? (
      <>
        <h5 className="mt-5 text-muted">Accepted Appointments</h5>
        <Cards cards={props?.acceptedCards} />
      </>
    ) : null;
  }

  function PendingAppointments() {
    return props?.pendingCards?.length ? (
      <>
        <h5 className="mt-5 text-muted">Pending Appointments</h5>
        <Cards cards={props?.pendingCards} />
      </>
    ) : null;
  }

  function RejectedAppointments() {
    return props?.rejectedCards?.length ? (
      <>
        <h5 className="mt-5 text-muted">Rejected Appointments</h5>
        <Cards cards={props?.rejectedCards} />
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
