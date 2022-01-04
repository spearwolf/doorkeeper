/* eslint-env mocha */
import supertest from "supertest";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";

describe("POST /token", () => {
  after(disconnectTokenStore);

  it("should respond with success when login credentials sent as json data", (done) => {
    supertest(app).post("/token").send({ login: "bar", password: "foobar" }).expect(200).end(done);
  });

  it("should respond with success when login credentials sent as form-urlencoded data", (done) => {
    supertest(app).post("/token").send("login=foo").send("password=foobar").expect(200).end(done);
  });

  it("should respond with error when unknown/invalid login credentials passed", (done) => {
    supertest(app).post("/token").send("login=foofoo").send("password=plah!").expect(400).end(done);
  });

  it("should respond with error when :login parameter is unset", (done) => {
    supertest(app).post("/token").send("password=secret").expect(400).end(done);
  });

  it("should respond with error when :password parameter is unset", (done) => {
    supertest(app).post("/token").send("login=foo").send("password=").expect(400).end(done);
  });

  it("should respond with error when no login credentials passed", (done) => {
    supertest(app).post("/token").expect(400).end(done);
  });
});
