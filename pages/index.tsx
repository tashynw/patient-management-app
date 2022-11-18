import NavBar from "../components/navbar";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CardsContainer from "../components/cards-container";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("User");

  async function getName() {
    const user: any = await getSession();
    setUserName(user?.firstName);
  }

  useEffect(() => {
    getName();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>
            Hello {userName}!
          </h2>
          <button
            className="btn btn-primary btn-lg"
            style={{ color: "white" }}
            onClick={() => router.push("/book")}
          >
            Book an appointment
          </button>
        </div>
        <CardsContainer />
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
