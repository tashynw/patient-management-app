import React, { useState } from "react";
import { AppointmentType, UserType } from "../types";
import Cards from "./cards";
import {
  Center,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
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

  const isEmpty: boolean =
    !props?.pendingCards?.length &&
    !props?.acceptedCards?.length &&
    !props?.rejectedCards?.length;
  const isAcceptedEmpty = props?.acceptedCards?.length == 0;
  const isPendingEmpty = props?.pendingCards?.length == 0;
  const isRejectedEmpty = props?.rejectedCards?.length == 0;

  return (
    <>
      <VStack w="100%" alignItems="flex-start" gap={5}>
        {isEmpty ? (
          <Center w="100%" mt={10}>
            <Heading mt={5} size="md" color="gray.600">
              {props?.pageSession?.role == "Patient"
                ? `No appointments made. Book an appointment now`
                : `No patient has booked you for an appointment.`}
            </Heading>
          </Center>
        ) : (
          <Tabs w="100%" mt={10}>
            <TabList>
              {!isAcceptedEmpty && <Tab>Accepted</Tab>}
              {!isPendingEmpty && <Tab>Pending</Tab>}
              {!isRejectedEmpty && <Tab>Rejected</Tab>}
            </TabList>

            <TabPanels>
              {!isAcceptedEmpty && (
                <TabPanel mt={8}>
                  <Cards
                    cards={props?.acceptedCards}
                    pageSession={props?.pageSession}
                    onViewAppointmentOpen={onViewAppointmentOpen}
                    setSelectedAppointment={setSelectedAppointment}
                  />
                </TabPanel>
              )}
              {!isPendingEmpty && (
                <TabPanel mt={8}>
                  <Cards
                    cards={props?.pendingCards}
                    pageSession={props?.pageSession}
                    onViewAppointmentOpen={onViewAppointmentOpen}
                    setSelectedAppointment={setSelectedAppointment}
                  />
                </TabPanel>
              )}
              {!isRejectedEmpty && (
                <TabPanel mt={8}>
                  <Cards
                    cards={props?.rejectedCards}
                    pageSession={props?.pageSession}
                    onViewAppointmentOpen={onViewAppointmentOpen}
                    setSelectedAppointment={setSelectedAppointment}
                  />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        )}
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
