import supertest from "supertest";
import app from "../../lib/app.js";

export default (loginJwt) =>
  supertest(app)
    .post("/token/session")
    .set({ Authorization: `Bearer ${loginJwt}` })
    .expect(200)
    .then((res) => res.text);
