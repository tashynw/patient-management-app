import NavBar from "../components/navbar";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import CardsContainer from "../components/cards-container";
import { UserType } from "../types";
import {
  Box,
  Button,
  HStack,
  Heading,
  SkeletonText,
  Spacer,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import { useQuery } from "react-query";
import { getAllDoctors, getPatientAppointments } from "../utils/apiService";
import BookAppointmentModal from "../components/modals/BookAppointmentModal";
import dayjs from "dayjs";

interface HomePageProps {
  pageSession: UserType;
  doctors: UserType[];
}

export default function Home({ pageSession, doctors }: HomePageProps) {
  const toast = useToast();
  const {
    isOpen: isBookAppointmentOpen,
    onOpen: onBookAppointmentOpen,
    onClose: onBookAppointmentClose,
  } = useDisclosure();
  const { data: appointments, isLoading } = useQuery(
    "appointments",
    () => getPatientAppointments(pageSession?.userId),
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
    <div>
      <NavBar pageSession={pageSession} />
      <div className="container">
        <HStack
          w="100%"
          mt={5}
          flexDir={["column", "row", "row"]}
          alignItems={["flex-start", "center", "center"]}
        >
          <VStack alignItems="flex-start">
            <Heading fontWeight="medium">
              Hello {pageSession?.firstName}!
            </Heading>
            <Text color="gray.600">
              {dayjs(new Date()).format("MMMM D, YYYY")}
            </Text>
          </VStack>
          <Spacer />
          <Button
            size="md"
            bg="blue.800"
            color="white"
            onClick={() => onBookAppointmentOpen()}
            _hover={{
              bg: "blue.900",
            }}
          >
            Book Appointment
          </Button>
        </HStack>
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
      <BookAppointmentModal
        isOpen={isBookAppointmentOpen}
        onClose={onBookAppointmentClose}
        doctors={doctors}
        userId={pageSession?.userId}
      />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session: any = await getServerSession(
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
  const doctors = await getAllDoctors();
  return {
    props: {
      pageSession: JSON.parse(JSON.stringify(session)),
      doctors: JSON.parse(JSON.stringify(doctors)),
    },
  };
}
