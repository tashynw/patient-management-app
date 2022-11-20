import React from "react";
import { AppointmentType, UserType } from "../types";
import Cards from "./cards";

interface CardsContainerProps {
  acceptedCards: AppointmentType[];
  pendingCards: AppointmentType[];
  rejectedCards: AppointmentType[];
  pageSession: UserType;
}

const CardsContainer = (props: CardsContainerProps) => {
  function AcceptedAppointments() {
    return props?.acceptedCards?.length ? (
      <>
        <h5 className="mt-5 text-muted">Accepted Appointments</h5>
        <Cards cards={props?.acceptedCards} pageSession={props?.pageSession} />
      </>
    ) : null;
  }

  function PendingAppointments() {
    return props?.pendingCards?.length ? (
      <>
        <h5 className="mt-5 text-muted">Pending Appointments</h5>
        <Cards cards={props?.pendingCards} pageSession={props?.pageSession} />
      </>
    ) : null;
  }

  function RejectedAppointments() {
    return props?.rejectedCards?.length ? (
      <>
        <h5 className="mt-5 text-muted">Rejected Appointments</h5>
        <Cards cards={props?.rejectedCards} pageSession={props?.pageSession} />
      </>
    ) : null;
  }

  const isEmpty: boolean = (!props?.pendingCards?.length && !props?.acceptedCards?.length && !props?.rejectedCards?.length)

  return (
    <>
      {isEmpty && 
        <div style={{marginTop:'100px'}}>
          <h5 className="text-center text-muted mt-5">{props?.pageSession?.role=="Patient" ? `No appointments made. Book an appointment now` : `No patient has booked you for an appointment.`}</h5>
        </div>
      }
      <AcceptedAppointments />
      <PendingAppointments />
      <RejectedAppointments />
    </>
  );
};

export default CardsContainer;
