import supertest from "supertest";
import app from "../../lib/app.js";

export default (token, status) => supertest(app).get("/token").set("Authorization", `Bearer ${token}`).expect(status);
