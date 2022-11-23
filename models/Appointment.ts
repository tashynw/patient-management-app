import { models, model, Schema } from "mongoose";

const AppointmentSchema: Schema = new Schema({
  appointmentId: {
    type: String,
    required: true,
    unique: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  appointmentStatus: {
    type: String,
    required: true,
  },
});

const Appointment =
  models.Appointment || model("Appointment", AppointmentSchema);

export default Appointment;
