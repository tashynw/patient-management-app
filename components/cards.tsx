import { useRouter } from "next/router";
import React from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { AppointmentType } from "../types/index";

interface CardProps {
  cards: AppointmentType[];
}

const Cards: React.FC<CardProps> = (props: CardProps) => {
  const router = useRouter();
  return (
    <div className="row mt-4 justify-content-start">
      {props?.cards?.map((card) => (
        <div
          className="appointment-card"
          key={card?.appointmentId}
          onClick={() =>
            router.push({
              pathname: `/appointment/${card.appointmentId}`,
              query: card,
            })
          }
        >
          <div className="card-header">
            <div className="icon-container">
              <HiOutlineUsers size={25} color="#23A6F0" />
            </div>
            <p>Dr. {card.doctorId}</p>
          </div>
          <div className="card-description">
            <p className="text-muted">
              <strong>Date: {card?.date}</strong>
            </p>
            <p className="text-muted">
              <strong>Time: {card?.time}</strong>
            </p>
            <p className="text-muted description-text">
              <strong>{card?.description}</strong>
            </p>
            <p className="text-primary">
              <strong>Status: {card?.appointmentStatus}</strong>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
