import config from "config";

import { isNonEmptyString } from "../utils/isNonEmptyString.js";

import decodeToken from "./decodeToken.js";
import { verifyToken } from "./store/index.js";

const authKey = config.get("authKey");

function fail(res) {
  res.sendStatus(400);
}

export default function (req, res, next) {
  const auth = req.get(authKey);

  if (!(isNonEmptyString(auth) && auth.startsWith("Bearer"))) {
    fail(res);
    return;
  }

  const token = auth.split(" ")[1];

  verifyToken(token)
    .then(decodeToken)
    .then(
      (tokenPayload) => {
        req.token = tokenPayload;
        req.encodedToken = token;
        next();
      },
      () => fail(res),
    );
}
