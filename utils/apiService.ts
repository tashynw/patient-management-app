import {
  AppointmentType,
  CreateAppointmentInput,
  CreateUserInput,
  LoginUserInput,
  UserType,
} from "../types";

const stage = process.env.NEXT_PUBLIC_STAGE || "";
const HOST_NAME: string =
  stage == "dev"
    ? "http://localhost:3000"
    : "https://patient-appointment-app.netlify.app";

export async function createUser(input: CreateUserInput): Promise<boolean> {
  try {
    const requestBody = { ...input, role: "Patient" };
    const request = await fetch(`${HOST_NAME}/api/user/signup`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });
    return request.ok;
  } catch (e) {
    console.log(`Error createUser() ${e}`);
    throw new Error(`Error in createUser()`);
  }
}

export async function createDoctor(input: CreateUserInput): Promise<boolean> {
  try {
    const requestBody = { ...input, role: "Doctor" };
    const request = await fetch(`${HOST_NAME}/api/user/signup`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });
    return request.ok;
  } catch (e) {
    console.log(`Error createUser() ${e}`);
    throw new Error(`Error in createUser()`);
  }
}

export async function loginUser(input: LoginUserInput): Promise<UserType> {
  try {
    const request = await fetch(`${HOST_NAME}/api/user/login`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
    });
    const user = await request.json();
    return user.body;
  } catch (e) {
    console.log(`Error loginUser() ${e}`);
    throw new Error(`Error in loginUser()`);
  }
}

export async function getUser(userId: string): Promise<UserType> {
  try {
    const request = await fetch(`${HOST_NAME}/api/user/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const user = await request.json();
    return user.body;
  } catch (e) {
    console.log(`Error getUser() ${e}`);
    throw new Error(`Error in getUser()`);
  }
}

export async function getUserFromEmail(email: string): Promise<UserType> {
  try {
    const requestBody = { email };
    const request = await fetch(`${HOST_NAME}/api/user/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const user = await request.json();
    user.body.password = "";
    return user.body;
  } catch (e) {
    console.log(`Error getUserFromEmail() ${e}`);
    throw new Error(`Error in getUserFromEmail()`);
  }
}

export async function getPatientsWithFirstName(
  firstName: string
): Promise<UserType[]> {
  try {
    const requestBody = { query: firstName };
    const request: Response = await fetch(`${HOST_NAME}/api/user/fetch`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const patients = await request.json();
    return patients.body;
  } catch (e) {
    console.log(`Error getPatientWithFirstName() ${e}`);
    throw new Error(`Error in getPatientWithFirstName()`);
  }
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<boolean> {
  try {
    const requestBody = { ...input, appointmentStatus: "Pending" };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/create`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    return request.ok;
  } catch (e) {
    console.error(`Error createAppointment() ${e}`);
    throw new Error(`Error in createAppointment()`);
  }
}

export async function getAppointment(
  appointmentId: string
): Promise<AppointmentType> {
  try {
    const request = await fetch(
      `${HOST_NAME}/api/appointment/${appointmentId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const appointment = await request.json();
    return appointment.body;
  } catch (e) {
    console.error(`Error getAppointment() ${e}`);
    throw new Error(`Error in getAppointment()`);
  }
}

export async function getPendingAppointments(
  patientId: string
): Promise<AppointmentType[]> {
  try {
    const requestBody = { patientId, query: "PENDING" };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/fetch`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    const appointments = await request.json();
    return appointments.body;
  } catch (e) {
    console.error(`Error getPendingAppointments() ${e}`);
    throw new Error(`Error in getPendingAppointments()`);
  }
}

export async function getAcceptedAppointments(
  patientId: string
): Promise<AppointmentType[]> {
  try {
    const requestBody = { patientId, query: "ACCEPTED" };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/fetch`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    const appointments = await request.json();
    return appointments.body;
  } catch (e) {
    console.error(`Error getAcceptedAppointments() ${e}`);
    throw new Error(`Error in getAcceptedAppointments()`);
  }
}

export async function getRejectedAppointments(
  patientId: string
): Promise<AppointmentType[]> {
  try {
    const requestBody = { patientId, query: "REJECTED" };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/fetch`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    const appointments = await request.json();
    return appointments.body;
  } catch (e) {
    console.error(`Error getRejectedAppointments() ${e}`);
    throw new Error(`Error in getRejectedAppointments()`);
  }
}

export async function getAllAppointments(
  patientId: string
): Promise<AppointmentType[]> {
  try {
    const requestBody = { patientId };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/fetch`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    const appointments = await request.json();
    return appointments.body;
  } catch (e) {
    console.error(`Error getAllAppointments() ${e}`);
    throw new Error(`Error in getAllAppointments()`);
  }
}

export async function getPendingAppointmentsForDoctor(
  doctorId: string
): Promise<AppointmentType[]> {
  try {
    const requestBody = { doctorId, query: "PENDING" };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/fetch`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    const appointments = await request.json();
    return appointments.body;
  } catch (e) {
    console.error(`Error getAllAppointmentsForDoctor() ${e}`);
    throw new Error(`Error in getAllAppointmentsForDoctor()`);
  }
}

export async function getAccceptedAppointmentsForDoctor(
  doctorId: string
): Promise<AppointmentType[]> {
  try {
    const requestBody = { doctorId, query: "ACCEPTED" };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/fetch`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    const appointments = await request.json();
    return appointments.body;
  } catch (e) {
    console.error(`Error getAllAppointmentsForDoctor() ${e}`);
    throw new Error(`Error in getAllAppointmentsForDoctor()`);
  }
}

export async function getRejectedAppointmentsForDoctor(
  doctorId: string
): Promise<AppointmentType[]> {
  try {
    const requestBody = { doctorId, query: "REJECTED" };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/fetch`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    const appointments = await request.json();
    return appointments.body;
  } catch (e) {
    console.error(`Error getAllAppointmentsForDoctor() ${e}`);
    throw new Error(`Error in getAllAppointmentsForDoctor()`);
  }
}

export async function updateAppointment(
  appointmentId: string,
  date: string,
  description: string,
  appointmentStatus: string
): Promise<boolean> {
  try {
    const requestBody = { date, description, appointmentStatus };
    const request: Response = await fetch(
      `${HOST_NAME}/api/appointment/edit/${appointmentId}`,
      {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    return request.ok;
  } catch (e) {
    console.error(`Error updateAppointment() ${e}`);
    throw new Error(`Error in updateAppointment()`);
  }
}

export async function getAllDoctors(): Promise<UserType[]> {
  try {
    const requestBody = { query: "Doctor" };
    const request: Response = await fetch(`${HOST_NAME}/api/user/fetch`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });
    const doctors = await request.json();
    return doctors.body;
  } catch (e) {
    console.error(`Error getAllDoctors() ${e}`);
    throw new Error(`Error in getAllDoctors()`);
  }
}

export async function getAllPatients(): Promise<UserType[]> {
  try {
    const requestBody = { query: "Patient" };
    const request: Response = await fetch(`${HOST_NAME}/api/user/fetch`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });
    const patients = await request.json();
    return patients.body;
  } catch (e) {
    console.error(`Error getAllPatients() ${e}`);
    throw new Error(`Error in getAllPatients()`);
  }
}

export async function updateUser(
  userId: string,
  age: number,
  phoneNumber: string,
  address: string
): Promise<boolean> {
  try {
    const requestBody = { age, phoneNumber, address };
    const request: Response = await fetch(
      `${HOST_NAME}/api/user/edit/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      }
    );
    return request.ok;
  } catch (e) {
    console.error(`Error updateUser() ${e}`);
    throw new Error(`Error in updateUser()`);
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const request: Response = await fetch(
      `${HOST_NAME}/api/user/delete/${userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    const appointments: AppointmentType[] = await getAllAppointments(userId);
    for (let appointment of appointments) {
      await fetch(
        `${HOST_NAME}/api/appointment/delete/${appointment?.appointmentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return request.ok;
  } catch (e) {
    console.error(`Error deleteUser() ${e}`);
    throw new Error(`Error in deleteUser()`);
  }
}

export async function getIpAddress(): Promise<string> {
  const res = await fetch("https://geolocation-db.com/json/");
  const json = await res.json();
  return json.IPv4;
}

export async function getPatientAppointments(patientId: string) {
  const request = await fetch(
    `${HOST_NAME}/api/appointment/patient?patientId=${patientId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const appointments = await request.json();
  return appointments as {
    acceptedCards: AppointmentType[];
    pendingCards: AppointmentType[];
    rejectedCards: AppointmentType[];
  };
}
export async function getDoctorAppointments(doctorId: string) {
  const request = await fetch(
    `${HOST_NAME}/api/appointment/doctor?doctorId=${doctorId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const appointments = await request.json();
  return appointments as {
    acceptedCards: AppointmentType[];
    pendingCards: AppointmentType[];
    rejectedCards: AppointmentType[];
  };
}

export async function getAllAppointmentsInSystem() {
  const request = await fetch(`${HOST_NAME}/api/appointment/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!request.ok)
    throw new Error("An error occurred while fetching the appointments");

  const appointments = await request.json();
  return appointments as AppointmentType[];
}
