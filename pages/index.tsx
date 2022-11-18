import NavBar from "../components/navbar";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import CardsContainer from "../components/cards-container";
import { getAcceptedAppointments, getPendingAppointments, getRejectedAppointments, getUser } from "../utils/apiService";
import { AppointmentType, UserType } from "../types";

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
      <NavBar pageSession={props?.pageSession}/>
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>
            Hello {props?.pageSession?.firstName}!
          </h2>
          <button
            className="btn btn-primary btn-lg"
            style={{ color: "white" }}
            onClick={() => router.push("/book")}
          >
            Book an appointment
          </button>
        </div>
        <CardsContainer acceptedCards={props?.acceptedCards} pendingCards={props?.pendingCards} rejectedCards={props?.rejectedCards} />
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

  if (!session) {
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
  for (let appointment of rejectedCards){
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
