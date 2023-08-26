import React from "react";
import CardsContainer from "../../components/cards-container";
import NavBar from "../../components/navbar";
import { AppointmentType, UserType } from "../../types";
import { getDoctorAppointments } from "../../utils/apiService";
import { authOptions } from "../api/auth/[...nextauth]";
import { Box, SkeletonText, useToast } from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import { useQuery } from "react-query";

interface DoctorAppointmentPageProps {
  pageSession: UserType;
  acceptedCards: AppointmentType[];
  pendingCards: AppointmentType[];
  rejectedCards: AppointmentType[];
}

const DoctorAppointmentsPage = ({
  pageSession,
}: DoctorAppointmentPageProps) => {
  const toast = useToast();
  const { data: appointments, isLoading } = useQuery(
    "appointments",
    () => getDoctorAppointments(pageSession?.userId),
    {
      onError(err) {
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
      <NavBar pageSession={pageSession} />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>Appointments</h2>
        </div>
        <br />
        <SkeletonText noOfLines={8} isLoaded={!isLoading}>
          <Box mb={10}>
            <CardsContainer
              acceptedCards={appointments?.acceptedCards!}
              pendingCards={appointments?.pendingCards!}
              rejectedCards={appointments?.rejectedCards!}
              pageSession={pageSession}
            />
          </Box>
        </SkeletonText>
      </div>
    </>
  );
};

export default DoctorAppointmentsPage;

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
