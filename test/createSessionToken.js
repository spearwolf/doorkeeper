/* eslint-env mocha */
import supertest from "supertest";
import assert from "assert";
import login from "./utils/login.js";
import verifyToken from "./utils/verifyToken.js";
import app from "../lib/app.js";
import { disconnectTokenStore } from "../lib/token/store/TokenStore.js";

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
});
