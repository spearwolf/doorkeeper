/* eslint-env mocha */

import chai from "chai";
import supertest from "supertest";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";

const { expect } = chai;

describe("GET /token", () => {
  after(async () => {
    await disconnectTokenStore();
  });

  it("should respond with decoded token content", (done) => {
    supertest(app)
      .post("/token")
      .send({ login: "bar", password: "foobar" })
      .expect(200)
      .end((err, res) => {
        expect(err).to.be.null; // eslint-disable-line

        const token = res.text;
        expect(token).to.be.not.empty; // eslint-disable-line

        supertest(app)
          .get("/token")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .expect("Content-Type", /application\/json/)
          .expect((res2) => {
            expect(res2.body.user).to.equal("bar");
          })
          .end(done);
      });
  });

  it("should respond with error when authorization header has an invalid token", (done) => {
    supertest(app).get("/token").set("Authorization", "Bearer abc123xyzfooo").expect(400).end(done);
  });

  it("should respond with error when no authorization header is passed", (done) => {
    supertest(app).get("/token").expect(400).end(done);
  });
});
