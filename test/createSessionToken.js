/* eslint-env mocha */
import supertest from "supertest";
import assert from "assert";
import login from "./utils/login.js";
import createSessionjwt from "./utils/createSessionJwt.js";
import verifyToken from "./utils/verifyToken.js";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";
import waitSomeSeconds from "./utils/waitSomeSeconds.js";

describe("POST /token/session", () => {
  after(disconnectTokenStore);

  it("should respond with success when login token sent within request header", async () => {
    const loginJwt = await login("foo", "barfoo");
    assert.ok(loginJwt);

    const sessionJwt = await supertest(app)
      .post("/token/session")
      .set({ Authorization: `Bearer ${loginJwt}` })
      .expect(200)
      .then((res) => res.text);

    assert.ok(sessionJwt);

    const sessionTokenContent = await verifyToken(sessionJwt, 200);
    assert.equal(sessionTokenContent.toktyp, "session");
    assert.equal(sessionTokenContent.sub, "foo");
  });

  it("session token should expire", async () => {
    const loginJwt = await login("foo", "barfoo");
    assert.ok(loginJwt);

    const sessionJwt = await createSessionjwt(loginJwt);
    assert.ok(sessionJwt);

    const sessionTokenContent = await verifyToken(sessionJwt, 200);
    assert.equal(sessionTokenContent.toktyp, "session");
    assert.ok(sessionTokenContent.iat);

    await waitSomeSeconds(2);

    // since the session token should be expire after 1 second(!) the next call should return with an error response
    await verifyToken(sessionJwt, 400);
  }).timeout(3000);

  it("last login time must exist", async () => {
    const loginJwt = await login("foo", "barfoo");
    assert.ok(loginJwt);

    const sessionJwt = await createSessionjwt(loginJwt);
    assert.ok(sessionJwt);

    await waitSomeSeconds(3);

    // since the last login time expire after 1 second(!) the next call should return with an error response
    await supertest(app)
      .post("/token/session")
      .set({ Authorization: `Bearer ${loginJwt}` })
      .expect(400);
  }).timeout(4000);
});
