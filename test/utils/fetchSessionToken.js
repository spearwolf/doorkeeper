import supertest from "supertest";
import app from "../../lib/app.js";

export default (loginToken) =>
  supertest(app)
    .post("/token/session")
    .set("Authorization", `Bearer ${loginToken}`)
    .expect(200)
    .then((res) => res.text);
