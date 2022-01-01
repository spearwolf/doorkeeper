/* eslint-env mocha */

// http://developers.redhat.com/blog/2016/03/15/test-driven-development-for-building-apis-in-node-js-and-express/

import supertest from "supertest";

import app from "../lib/app.js";

describe("GET /token/public.pem", () => {
  it("should return public key file", (done) => {
    supertest(app)
      .get("/token/public.pem")
      .expect(200)
      .expect(/BEGIN PUBLIC KEY/)
      .expect(/END PUBLIC KEY/)
      .end(done);
  });
});
