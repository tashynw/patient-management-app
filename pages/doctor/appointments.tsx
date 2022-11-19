import { unstable_getServerSession } from "next-auth";
import React from "react";
import CardsContainer from "../../components/cards-container";
import NavBar from "../../components/navbar";
import { AppointmentType, UserType } from "../../types";
import {
  getAccceptedAppointmentsForDoctor,
  getPendingAppointmentsForDoctor,
  getRejectedAppointmentsForDoctor,
  getUser,
} from "../../utils/apiService";
import { authOptions } from "../api/auth/[...nextauth]";

interface DoctorAppointmentPageProps {
  pageSession: UserType;
  acceptedCards: AppointmentType[];
  pendingCards: AppointmentType[];
  rejectedCards: AppointmentType[];
}

const DoctorAppointmentsPage = (props: DoctorAppointmentPageProps) => {
  return (
    <>
      <NavBar pageSession={props?.pageSession} />
      <div className="container">
        <CardsContainer
          acceptedCards={props?.acceptedCards}
          pendingCards={props?.pendingCards}
          rejectedCards={props?.rejectedCards}
          pageSession={props?.pageSession}
        />
      </div>
    </>
  );
};

export default DoctorAppointmentsPage;

export async function getServerSideProps(context: any) {
  const session: any = await unstable_getServerSession(
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

  const acceptedCards = await getAccceptedAppointmentsForDoctor(
    session?.userId
  );
  for (let appointment of acceptedCards) {
    const patient = await getUser(appointment.patientId);
    appointment.patientId = `${patient?.firstName} ${patient?.lastName}`;
  }

  const pendingCards = await getPendingAppointmentsForDoctor(session?.userId);
  for (let appointment of pendingCards) {
    const patient = await getUser(appointment.patientId);
    appointment.patientId = `${patient?.firstName} ${patient?.lastName}`;
  }

  const rejectedCards = await getRejectedAppointmentsForDoctor(session?.userId);
  for (let appointment of rejectedCards) {
    const patient = await getUser(appointment.patientId);
    appointment.patientId = `${patient?.firstName} ${patient?.lastName}`;
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
