import React from "react";
import { AppointmentType, UserType } from "../types";
import Cards from "./cards";
import { Center, Heading, Text } from "@chakra-ui/react";

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
        <Text fontSize="larger" fontWeight="medium" color="gray.600" mt={8}>
          Accepted Appointments
        </Text>
        <Cards cards={props?.acceptedCards} pageSession={props?.pageSession} />
      </>
    ) : null;
  }

  function PendingAppointments() {
    return props?.pendingCards?.length ? (
      <>
        <Text fontSize="larger" fontWeight="medium" color="gray.600" mt={8}>
          Pending Appointments
        </Text>
        <Cards cards={props?.pendingCards} pageSession={props?.pageSession} />
      </>
    ) : null;
  }

  function RejectedAppointments() {
    return props?.rejectedCards?.length ? (
      <>
        <Text fontSize="larger" fontWeight="medium" color="gray.600" mt={8}>
          Rejected Appointments
        </Text>
        <Cards cards={props?.rejectedCards} pageSession={props?.pageSession} />
      </>
    ) : null;
  }

  const isEmpty: boolean =
    !props?.pendingCards?.length &&
    !props?.acceptedCards?.length &&
    !props?.rejectedCards?.length;

  return (
    <>
      {isEmpty && (
        <div style={{ marginTop: "100px" }}>
          <Center>
            <Heading mt={5} size="md" color="gray.600">
              {props?.pageSession?.role == "Patient"
                ? `No appointments made. Book an appointment now`
                : `No patient has booked you for an appointment.`}
            </Heading>
          </Center>
        </div>
      )}
      <AcceptedAppointments />
      <PendingAppointments />
      <RejectedAppointments />
    </>
  );
};

export default CardsContainer;
