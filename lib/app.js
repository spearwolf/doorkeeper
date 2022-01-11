import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import destroyAllTokens from "./token/destroyAllTokens.js";
import loginViaPassword from "./token/loginViaPassword.js";
import showTokenContent from "./token/showTokenContent.js";
import verifyToken from "./token/verifyToken.js";

const app = express();

// ----------------------------------- ----  --   -
// middlewares
// ----------------------------------- ----  --   -

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ----------------------------------- ----  --   -
// routes
// ----------------------------------- ----  --   -

app.post("/token/login", loginViaPassword);
app.get("/token", verifyToken(), showTokenContent);
app.delete("/tokens", verifyToken({ roles: "admin" }), destroyAllTokens);

// --- -

export default app;
