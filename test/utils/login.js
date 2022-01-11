import supertest from "supertest";
import app from "../../lib/app.js";

export default (login, password) =>
  supertest(app)
    .post("/token/login")
    .send({ login, password })
    .expect(200)
    .then((res) => res.text);
