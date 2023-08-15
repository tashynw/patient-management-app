import NavBar from "../components/navbar";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import CardsContainer from "../components/cards-container";
import {
  getAcceptedAppointments,
  getPendingAppointments,
  getRejectedAppointments,
  getUser,
} from "../utils/apiService";
import { AppointmentType, UserType } from "../types";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";

interface HomePageProps {
  acceptedCards: AppointmentType[];
  pendingCards: AppointmentType[];
  rejectedCards: AppointmentType[];
  pageSession: UserType;
}

export default function Home(props: HomePageProps) {
  const router = useRouter();

  return (
    <div>
      <NavBar pageSession={props?.pageSession} />
      <div className="container">
        <HStack
          w="100%"
          mt={5}
          flexDir={["column", "row", "row"]}
          alignItems={["flex-start", "center", "center"]}
        >
          <VStack alignItems="flex-start">
            <Heading fontWeight="medium">
              Hello {props?.pageSession?.firstName}!
            </Heading>
            <Text color="gray.600">{new Date().toDateString()}</Text>
          </VStack>
          <Spacer />
          <Button
            size="md"
            bg="blue.800"
            color="white"
            onClick={() => router.push("/book")}
          >
            Book Appointment
          </Button>
        </HStack>
        <Box mb={10}>
          <CardsContainer
            acceptedCards={props?.acceptedCards}
            pendingCards={props?.pendingCards}
            rejectedCards={props?.rejectedCards}
            pageSession={props?.pageSession}
          />
        </Box>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || session?.role == "Doctor") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const acceptedCards = await getAcceptedAppointments(session?.userId);
  for (let appointment of acceptedCards) {
    const doctor = await getUser(appointment.doctorId);
    appointment.doctorId = doctor?.lastName;
  }

  const pendingCards = await getPendingAppointments(session?.userId);
  for (let appointment of pendingCards) {
    const doctor = await getUser(appointment.doctorId);
    appointment.doctorId = doctor?.lastName;
  }

  const rejectedCards = await getRejectedAppointments(session?.userId);
  for (let appointment of rejectedCards) {
    const doctor = await getUser(appointment.doctorId);
    appointment.doctorId = doctor?.lastName;
  }

  return {
    props: {
      pageSession: JSON.parse(JSON.stringify(session)),
      acceptedCards: JSON.parse(JSON.stringify(acceptedCards)),
      pendingCards: JSON.parse(JSON.stringify(pendingCards)),
      rejectedCards: JSON.parse(JSON.stringify(rejectedCards)),
    },
  };
}
