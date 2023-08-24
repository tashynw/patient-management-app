import React, { useState } from "react";
import { AppointmentType, UserType } from "../types";
import Cards from "./cards";
import { Center, Heading, Text, VStack, useDisclosure } from "@chakra-ui/react";
import ViewAppointmentDrawer from "./drawers/ViewAppointmentDrawer";

interface CardsContainerProps {
  acceptedCards: AppointmentType[];
  pendingCards: AppointmentType[];
  rejectedCards: AppointmentType[];
  pageSession: UserType;
}

const CardsContainer = (props: CardsContainerProps) => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType>();
  const {
    isOpen: isViewAppointmentOpen,
    onOpen: onViewAppointmentOpen,
    onClose: onViewAppointmentClose,
  } = useDisclosure();

  function AcceptedAppointments() {
    return props?.acceptedCards?.length ? (
      <>
        <Text fontSize="larger" fontWeight="medium" color="gray.600" mt={8}>
          Accepted Appointments
        </Text>
        <Cards
          cards={props?.acceptedCards}
          pageSession={props?.pageSession}
          onViewAppointmentOpen={onViewAppointmentOpen}
          setSelectedAppointment={setSelectedAppointment}
        />
      </>
    ) : null;
  }

  function PendingAppointments() {
    return props?.pendingCards?.length ? (
      <>
        <Text fontSize="larger" fontWeight="medium" color="gray.600" mt={8}>
          Pending Appointments
        </Text>
        <Cards
          cards={props?.pendingCards}
          pageSession={props?.pageSession}
          onViewAppointmentOpen={onViewAppointmentOpen}
          setSelectedAppointment={setSelectedAppointment}
        />
      </>
    ) : null;
  }

  function RejectedAppointments() {
    return props?.rejectedCards?.length ? (
      <>
        <Text fontSize="larger" fontWeight="medium" color="gray.600" mt={8}>
          Rejected Appointments
        </Text>
        <Cards
          cards={props?.rejectedCards}
          pageSession={props?.pageSession}
          onViewAppointmentOpen={onViewAppointmentOpen}
          setSelectedAppointment={setSelectedAppointment}
        />
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
      <VStack w="100%" alignItems="flex-start" gap={5}>
        <AcceptedAppointments />
        <PendingAppointments />
        <RejectedAppointments />
      </VStack>
      <ViewAppointmentDrawer
        isOpen={isViewAppointmentOpen}
        onClose={onViewAppointmentClose}
        appointment={selectedAppointment!}
        pageSession={props?.pageSession}
      />
    </>
  );
};

export default CardsContainer;
