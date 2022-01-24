/* eslint-env mocha */
import supertest from "supertest";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";
import fetchSessionToken from "./utils/fetchSessionToken.js";
import login from "./utils/login.js";
import verifyToken from "./utils/verifyToken.js";

describe("DELETE /tokens", () => {
  after(disconnectTokenStore);

  it("should destroy all tokens and invalidates all login tokens", async () => {
    const loginTokenAnyUser = await login("bar", "barplah");
    const loginTokenAdmin = await login("admin", "top-secret");

    const adminSessionToken = await fetchSessionToken(loginTokenAdmin);

    await supertest(app)
      .delete("/tokens")
      .set("Authorization", `Bearer ${adminSessionToken}`)
      .expect(200);

    await Promise.all([verifyToken(loginTokenAnyUser, 400), verifyToken(loginTokenAdmin, 400)]);
  });

  it("should NOT destroy all tokens if 'admin' role is not in token", async () => {
    const loginToken = await login("foo", "barfoo");
    const sessionToken = await fetchSessionToken(loginToken);

    await supertest(app)
      .delete("/tokens")
      .set("Authorization", `Bearer ${sessionToken}`)
      .expect(400);
  });

  it("should NOT destroy all tokens if 'admin' role is present but token is login token (must be a session token)", async () => {
    const loginToken = await login("admin", "top-secret");
    const sessionToken = await fetchSessionToken(loginToken);

    await supertest(app).delete("/tokens").set("Authorization", `Bearer ${loginToken}`).expect(400);

    await supertest(app)
      .delete("/tokens")
      .set("Authorization", `Bearer ${sessionToken}`)
      .expect(200);
  });

  it("should respond with error when authorization header has an invalid token", () =>
    supertest(app).delete("/tokens").set("Authorization", "Bearer abc123xyzfooo").expect(400));

  it("should respond with error when no authorization header is passed", () =>
    supertest(app).delete("/tokens").expect(400));
});
