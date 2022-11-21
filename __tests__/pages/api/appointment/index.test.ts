import { RequestMethod, createMocks } from "node-mocks-http";
import * as createHandler from "../../../../pages/api/appointment/create/index";
import * as getHandler from "../../../../pages/api/appointment/[id]";
import * as fetchHandler from "../../../../pages/api/appointment/fetch/index";

describe("/api/user/fetch API", () => {
  function mockRequestResponse(method: RequestMethod = "POST") {
    const { req, res } = createMocks({ method });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  it("should return a 200 (creating first appointment)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = {
      doctorId: "abcdefg",
      patientId: "hijklmno",
      date: "21/11/22",
      time: "4:00 pm",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      appointmentStatus: "Pending",
    };
    await createHandler.default(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 200 (creating second appointment)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = {
      doctorId: "abcdefg",
      patientId: "hijklmno",
      date: "21/11/22",
      time: "4:00 pm",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      appointmentStatus: "Pending",
    };
    await createHandler.default(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 400 (creating second appointment - invalid request)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = {
      doctorId: "testid",
      patientId: "testid2",
      date: "21/11/22",
      time: "3:00 pm",
      appointmentStatus: "Pending",
    };
    await createHandler.default(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should return a 200 (appointment query)", async function () {
    const { req, res } = mockRequestResponse();
    req.query = { id: "c61e9068-07d1-43bd-b49c-7721f3626ae0" };
    await getHandler.default(req, res);
    expect(res.statusCode).toBe(200);
  });

  it("should return a 400 (appointment query failed)", async function () {
    const { req, res } = mockRequestResponse();
    req.query = { id: "testval" };
    await getHandler.default(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should return a 400 (appointment pending fetch query - no pending appointments)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = {
      patientId: "1c1fd3e8-6683-4b2c-ab3e-0c66e434b941",
      query: "PENDING",
    };
    await getHandler.default(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should return a 200 (appointment active fetch query)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = {
      patientId: "1c1fd3e8-6683-4b2c-ab3e-0c66e434b941",
      query: "ACTIVE",
    };
    await fetchHandler.default(req, res);
    expect(res.statusCode).toBe(200);
  });

  it("should return a 200 (appointment rejected fetch query)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = {
      patientId: "1c1fd3e8-6683-4b2c-ab3e-0c66e434b941",
      query: "REJECTED",
    };
    await fetchHandler.default(req, res);
    expect(res.statusCode).toBe(200);
  });

  it("should return a 400 (appointment fetch query - invalid request)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = {
      patientIdd: "1c1fd3e8-6683-4b2c-ab3e-0c66e434b941",
      querys: "testval",
    };
    await fetchHandler.default(req, res);
    expect(res.statusCode).toBe(400);
  });
});

export {};
