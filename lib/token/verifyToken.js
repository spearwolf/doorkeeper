import config from "config";
import { isNonEmptyString } from "../utils/isNonEmptyString.js";
import { verifyToken } from "./store/index.js";

const authKey = config.get("authKey");
const jwtIssuer = config.get("jwt.iss");

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
    const tokenContent = await verifyToken(token);
    if (tokenContent.iss !== jwtIssuer) {
      throw "this is not mine";
    }

    req.token = tokenContent;
    req.encodedToken = token;

    next();
  } catch {
    fail(res);
  }
}
