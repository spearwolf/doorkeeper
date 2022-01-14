import bodyParser from "body-parser";
import config from "config";
import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";
import logger from "./logger.js";
import createSessionToken from "./token/createSessionToken.js";
import destroyAllTokens from "./token/destroyAllTokens.js";
import loginViaPassword from "./token/loginViaPassword.js";
import showTokenContent from "./token/showTokenContent.js";
import verifyToken, { verifyLoginToken, verifySessionToken } from "./token/verifyToken.js";

const app = express();

// ----------------------------------- ----  --   -
// middlewares
// ----------------------------------- ----  --   -

app.use(pinoHttp({ logger, autoLogging: config.get("log.httpRequests") }));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ----------------------------------- ----  --   -
// routes
// ----------------------------------- ----  --   -

app.post("/token/login", loginViaPassword);
app.post("/token/session", verifyLoginToken(), createSessionToken);

app.get("/token", verifyToken(), showTokenContent);

app.delete("/tokens", verifySessionToken({ roles: "admin" }), destroyAllTokens);

// --- -

export default app;
