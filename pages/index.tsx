import NavBar from "../components/navbar";
import { BsSun } from "react-icons/bs";
import Cards from "../components/cards";

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
