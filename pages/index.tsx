import NavBar from "../components/navbar";
import { BsSun } from "react-icons/bs";
import Cards from "../components/cards";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="h-100 d-flex justify-content-between align-items-center mt-5">
          <h2>
            Hello Tashyn!
            <span className="ml-3">
              <BsSun color="orange" />
            </span>
          </h2>
          <button className="btn btn-primary btn-lg" style={{ color: "white" }}>
            Book an appointment
          </button>
        </div>
        <h5 className="mt-5 text-muted">Active Appointments</h5>
        <Cards />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(context.req,context.res,authOptions);

  if(!session){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  
  return {
    props: {
      session: JSON.parse(JSON.stringify(session)) 
    },
  }
}