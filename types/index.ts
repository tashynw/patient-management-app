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
  time: string;
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
  ipAddress: string;
  age?: number;
  phoneNumber?: string;
  address?: string;
};

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  ipAddress: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export type CreateAppointmentInput = {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  description: string;
};

export const AppointmentFetchQueries: { [key: string]: string } = {
  PENDING: "Pending",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

export type FetchAppointmentInput = {
  patientId: string;
  appointmentStatus: string;
};
