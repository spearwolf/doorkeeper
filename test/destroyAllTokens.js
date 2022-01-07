/* eslint-env mocha */
import supertest from "supertest";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";
import login from "./utils/login.js";
import verifyToken from "./utils/verifyToken.js";

describe("DELETE /tokens", () => {
  after(disconnectTokenStore);

  it("should destroy all tokens", () =>
    login("bar", "barplah").then((tokenA) =>
      verifyToken(tokenA, 200)
        .then(() => login("admin", "top-secret"))
        .then((tokenB) =>
          supertest(app)
            .delete("/tokens")
            .set("Authorization", `Bearer ${tokenB}`)
            .expect(200)
            .then(() => Promise.all([verifyToken(tokenA, 400), verifyToken(tokenB, 400)])),
        ),
    ));

  it("should NOT destroy all tokens if 'admin' role is not in token", () =>
    login("bar", "barplah").then((tokenA) =>
      verifyToken(tokenA, 200)
        .then(() => login("foo", "foobar"))
        .then((tokenB) => supertest(app).delete("/tokens").set("Authorization", `Bearer ${tokenB}`).expect(400)),
    ));

  it("should respond with error when authorization header has an invalid token", () =>
    supertest(app).delete("/tokens").set("Authorization", "Bearer abc123xyzfooo").expect(400));

  it("should respond with error when no authorization header is passed", () => supertest(app).delete("/tokens").expect(400));
});
