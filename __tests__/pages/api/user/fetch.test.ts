import { RequestMethod, createMocks } from "node-mocks-http";
import handler from "../../../../pages/api/user/fetch/index";

describe("/api/user/fetch API", () => {
  function mockRequestResponse(method: RequestMethod = "GET") {
    const { req, res } = createMocks({ method });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  it("should return a 200 (Doctor query)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = { query: "Doctor" };
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 200 (patient query)", async function () {
    const { req, res } = mockRequestResponse();
    req.body = { query: "Patient" };
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 400", async function () {
    const { req, res } = mockRequestResponse();
    req.body = { queryBody: "Patients" };
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });
});

export {};
