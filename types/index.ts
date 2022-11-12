import { Mongoose } from "mongoose";

declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

export type AppointmentType = {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  date: string;
  description: string;
  appointmentStatus: string;
};

export type UserType = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  age?: number;
  phoneNumber?: string;
  address?: string;
};
