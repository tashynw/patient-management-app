import {
  AppointmentType,
  CreateAppointmentInput,
  CreateUserInput,
  LoginUserInput,
  UserType,
} from "../types";

const HOST_NAME: string = "http://localhost:3000";

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
    console.log(`Error loginUser() ${e}`);
    throw new Error(`Error in loginUser()`);
  }
}

export async function getPatientsWithFirstName(firstName: string): Promise<UserType[]> {
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
    const request = await fetch(`${HOST_NAME}/api/appointment/${appointmentId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const appointment = await request.json();
    return appointment.body;
  } catch (e) {
    console.error(`Error getPendingAppointments() ${e}`);
    throw new Error(`Error in getPendingAppointments()`);
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

export async function updateUser(userId: string,age: number, phoneNumber: string, address: string): Promise<boolean>{
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

export async function deleteUser(userId: string): Promise<boolean>{
  try {
    const request: Response = await fetch(
      `${HOST_NAME}/api/user/delete/${userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    const appointments: AppointmentType[] = await getAllAppointments(userId);
    for(let appointment of appointments){
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
