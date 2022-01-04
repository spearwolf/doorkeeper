/* eslint-env mocha */
import supertest from "supertest";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";

const login = (user, secret) =>
  supertest(app)
    .post("/token")
    .send({ login: user, password: secret })
    .expect(200)
    .then((res) => res.text);

const verifyToken = (token, status) => supertest(app).get("/token").set("Authorization", `Bearer ${token}`).expect(status);

describe("DELETE /tokens", () => {
  after(disconnectTokenStore);

  it("should destroy all tokens", () =>
    login("bar", "barplah").then((tokenA) =>
      verifyToken(tokenA, 200)
        .then(() => login("foo", "foobar"))
        .then((tokenB) =>
          supertest(app)
            .delete("/tokens")
            .set("Authorization", `Bearer ${tokenB}`)
            .expect(200)
            .then(() => Promise.all([verifyToken(tokenA, 400), verifyToken(tokenB, 400)])),
        ),
    ));

  it("should respond with error when authorization header has an invalid token", () =>
    supertest(app).delete("/tokens").set("Authorization", "Bearer abc123xyzfooo").expect(400));

  it("should respond with error when no authorization header is passed", () => supertest(app).delete("/tokens").expect(400));
});
