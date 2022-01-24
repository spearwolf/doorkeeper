/* eslint-env mocha */
import supertest from "supertest";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";

describe("POST /token/login", () => {
  after(disconnectTokenStore);

  it("should respond with success when login credentials sent as json data", (done) => {
    supertest(app)
      .post("/token/login")
      .send({ login: "bar", password: "barplah" })
      .expect(200)
      .end(done);
  });

  it("should respond with success when login credentials sent as form-urlencoded data", (done) => {
    supertest(app)
      .post("/token/login")
      .send("login=foo")
      .send("password=barfoo")
      .expect(200)
      .end(done);
  });

  it("should respond with error when unknown/invalid login credentials passed", (done) => {
    supertest(app)
      .post("/token/login")
      .send("login=foofoo")
      .send("password=plah!")
      .expect(400)
      .end(done);
  });

  it("should respond with error when :login parameter is unset", (done) => {
    supertest(app).post("/token/login").send("password=secret").expect(400).end(done);
  });

  it("should respond with error when :password parameter is unset", (done) => {
    supertest(app).post("/token/login").send("login=foo").send("password=").expect(400).end(done);
  });

  it("should respond with error when no login credentials passed", (done) => {
    supertest(app).post("/token/login").expect(400).end(done);
  });
});
