import NavBar from "../components/navbar";
import { BsSun } from "react-icons/bs";
import Cards from "../components/cards";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { getPendingAppointments, getUser } from "../utils/apiService";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AppointmentType } from "../types";

export default function Home() {
  const router = useRouter();
  const [cards, setCards] = useState<AppointmentType[]>([]);
  const [userName, setUserName] = useState<string>("User");

  async function getCards() {
    const user: any = await getSession();
    setUserName(user?.firstName);

    const appointmentCards = await getPendingAppointments(user?.userId);
    console.log(appointmentCards);
    for (let appointment of appointmentCards) {
      const doctor = await getUser(appointment.doctorId);
      appointment.doctorId = doctor?.lastName;
    }
    setCards(appointmentCards);
  }

  useEffect(() => {
    getCards();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>
            Hello {userName}!
            <span className="ml-3">
              <BsSun color="orange" />
            </span>
          </h2>
          <button
            className="btn btn-primary btn-lg"
            style={{ color: "white" }}
            onClick={() => router.push("/book")}
          >
            Book an appointment
          </button>
        </div>
        <h5 className="mt-5 text-muted">Active Appointments</h5>
        <Cards cards={cards} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
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

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  };
}
