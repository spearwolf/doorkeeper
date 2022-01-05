/* eslint-env mocha */
import supertest from "supertest";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";

describe("POST /token - using static users", () => {
  after(disconnectTokenStore);

  it("should respond with success when login credentials are from static users file", (done) => {
    supertest(app).post("/token").send({ login: "admin", password: "top-secret" }).expect(200).end(done);
  });

  it("should respond with error when secret from static users file is wrong for the given login id, but otherwise the secret would be correct", async () => {
    await supertest(app).post("/token").send({ login: "admin", password: "foo-admin" }).expect(400);
    await supertest(app).post("/token").send({ login: "foo", password: "foo-foo" }).expect(200);
  });
});
