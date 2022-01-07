import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import createToken from "./token/createToken.js";
import destroyAllTokens from "./token/destroyAllTokens.js";
import sendPublicKey from "./token/sendPublicKey.js";
import showToken from "./token/showToken.js";
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

app.get("/token/public.pem", sendPublicKey);
app.get("/token", verifyToken(), showToken);
app.post("/token", createToken);
app.delete("/tokens", verifyToken({ roles: "admin" }), destroyAllTokens);

// --- -

export default app;
