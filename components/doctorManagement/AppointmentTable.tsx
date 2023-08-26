import React, { useState } from "react";
import { useQuery } from "react-query";
import { getAllAppointmentsInSystem } from "../../utils/apiService";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { AppointmentType } from "../../types";
import ViewAppointmentDescription from "../drawers/ViewAppointmentDescription";
import DataTableBase from "../DataTableBase";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type Props = {};

const AppointmentTable = (props: Props) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredAppointments, setFilteredAppointments] =
    useState<AppointmentType[]>();
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType>();
  const { data: appointmentsData, isLoading } = useQuery(
    `all-appointments`,
    () => getAllAppointmentsInSystem(),
    {
      onError() {
        toast({
          title: `Error`,
          description: "Error fetching appointments.",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );
  return (
    <>
      <VStack w="100%" alignItems="flex-start" gap={5} mt={5}>
        <InputGroup>
          <InputLeftElement pointerEvents="none" height={`100%`} mx={1}>
            <FiSearch size={`20px`} color="gray" />
          </InputLeftElement>
          <Input
            bg={`white`}
            placeholder="Search by doctor or patient name"
            rounded="md"
            width={[`100%`, `md`]}
            disabled={isLoading}
            onChange={(e) => {
              const searchInput = e.target.value;
              const filteredTable = appointmentsData!?.filter((appointment) => {
                return (
                  appointment?.doctorId
                    ?.toLowerCase()
                    ?.includes(searchInput?.toLowerCase()) ||
                  appointment?.patientId
                    ?.toLowerCase()
                    ?.includes(searchInput?.toLowerCase())
                );
              });
              setFilteredAppointments(filteredTable);
            }}
          />
        </InputGroup>
        <DataTableBase
          isLoading={isLoading}
          columns={[
            {
              name: `Doctor Name`,
              sortable: true,
              selector: (row) => row?.doctorId || `-`,
            },
            {
              name: `Patient Name`,
              sortable: true,
              selector: (row) => row?.patientId || `-`,
            },
            {
              name: `Date`,
              sortable: true,
              selector: (row) =>
                dayjs(new Date(row?.date)).format("MMMM D, YYYY") || `-`,
            },
            {
              name: `Time`,
              selector: (row) =>
                dayjs(row?.time, "HH:mm").format("h:mm a") || `-`,
            },
            {
              name: `Status`,
              sortable: true,
              selector: (row) => row?.appointmentStatus || `-`,
            },
            {
              name: ``,
              cell: (row) => (
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => {
                    setSelectedAppointment(row);
                    onOpen();
                  }}
                >
                  Description
                </Button>
              ),
            },
          ]}
          data={
            !filteredAppointments
              ? appointmentsData! ?? []
              : filteredAppointments
          }
        />
      </VStack>
      <ViewAppointmentDescription
        isOpen={isOpen}
        onClose={onClose}
        appointment={selectedAppointment!}
      />
    </>
  );
};

export default AppointmentTable;
