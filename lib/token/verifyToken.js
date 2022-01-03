import config from "config";
import { isNonEmptyString } from "../utils/isNonEmptyString.js";
import { verifyToken } from "./store/index.js";

const authKey = config.get("authKey");

function fail(res) {
  res.sendStatus(400);
}

export default async function (req, res, next) {
  const auth = req.get(authKey);

  if (!(isNonEmptyString(auth) && auth.startsWith("Bearer"))) {
    fail(res);
    return;
  }

  const token = auth.split(" ")[1];

  try {
    req.token = await verifyToken(token);
    req.encodedToken = token;

    next();
  } catch {
    fail(res);
  }
}
