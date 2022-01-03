import jwt from "jsonwebtoken";

import { PRIVATE_KEY } from "./keys.js";
import { storeToken } from "./store/index.js";

function fail(res) {
  res.sendStatus(400);
}

const createTokenPayload = (user) => ({ user });

const isAuthorized = (login, password) =>
  typeof login === "string" &&
  typeof password === "string" &&
  login.length > 2 &&
  password.length &&
  password.indexOf(login) !== -1;

const signToken = (data) => jwt.sign(data, PRIVATE_KEY, { algorithm: "RS256" });

export default function (req, res) {
  const login = req.body?.login?.trim();
  const password = req.body?.password?.trim();

  if (isAuthorized(login, password)) {
    storeToken(signToken(createTokenPayload(login)))
      .then((token) => {
        res.setHeader("Content-Type", "application/jwt");
        res.send(token);
      })
      .catch(() => {
        fail(res);
      });
  } else {
    fail(res);
  }
}
