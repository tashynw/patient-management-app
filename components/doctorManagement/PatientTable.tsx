import {
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import React, { useState } from "react";
import DataTableBase from "../DataTableBase";
import { useQuery } from "react-query";
import { getAllPatients } from "../../utils/apiService";
import { UserType } from "../../types";

type Props = {};

const PatientTable = (props: Props) => {
  const toast = useToast();
  const [filteredPatients, setFilteredPatients] = useState<UserType[]>();
  const { data: patientsData, isLoading } = useQuery(
    `patients`,
    () => getAllPatients(),
    {
      onError() {
        toast({
          title: `Error`,
          description: "Error fetching patients.",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      },
    }
  );
  return (
    <VStack w="100%" alignItems="flex-start" gap={5} mt={5}>
      <InputGroup>
        <InputLeftElement pointerEvents="none" height={`100%`} mx={1}>
          <FiSearch size={`20px`} color="gray" />
        </InputLeftElement>
        <Input
          bg={`white`}
          placeholder="Search by patient name or email"
          rounded="md"
          width={[`100%`, `md`]}
          disabled={isLoading}
          onChange={(e) => {
            const searchInput = e.target.value;
            const filteredTable = patientsData!?.filter((patient) => {
              return (
                patient?.firstName
                  ?.toLowerCase()
                  ?.includes(searchInput?.toLowerCase()) ||
                patient?.lastName
                  ?.toLowerCase()
                  ?.includes(searchInput?.toLowerCase()) ||
                `${patient?.firstName
                  ?.toLowerCase()
                  ?.trim()} ${patient?.lastName
                  ?.toLowerCase()
                  ?.trim()}`?.includes(searchInput?.toLowerCase()) ||
                patient?.email
                  ?.toLowerCase()
                  ?.includes(searchInput?.toLowerCase())
              );
            });
            setFilteredPatients(filteredTable);
          }}
        />
      </InputGroup>
      <DataTableBase
        isLoading={isLoading}
        columns={[
          {
            name: `First Name`,
            sortable: true,
            selector: (row) => row?.firstName || `-`,
          },
          {
            name: `Last Name`,
            sortable: true,
            selector: (row) => row?.lastName || `-`,
          },
          {
            name: `Email`,
            sortable: true,
            selector: (row) => row?.email || `-`,
          },
          {
            name: `Age`,
            sortable: true,
            selector: (row) => row?.age || `-`,
          },
        ]}
        data={!filteredPatients ? patientsData! ?? [] : filteredPatients}
      />
    </VStack>
  );
};

export default PatientTable;
