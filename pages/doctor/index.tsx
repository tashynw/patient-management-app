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
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import AppointmentTable from "../../components/doctorManagement/AppointmentTable";
import PatientTable from "../../components/doctorManagement/PatientTable";

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
        <VStack w="100%" alignItems="flex-start" mt={7} gap={7}>
          <Heading fontWeight="medium">Doctor Management</Heading>
          <Tabs w="100%">
            <TabList>
              <Tab>Appointments</Tab>
              <Tab>Patients</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AppointmentTable />
              </TabPanel>
              <TabPanel>
                <PatientTable />
              </TabPanel>
              <TabPanel>
                <AppointmentTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
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
