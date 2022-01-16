import config from "config";
import jwt from "jsonwebtoken";
import { TOKEN_KEY_TYPE, TOKEN_TYPE_SESSION } from "./constants.js";
import { PRIVATE_KEY, PRIVATE_KEY_PASSPHRASE } from "./keys.js";

const expiresIn = config.get("token.session.expiresIn");

export default (data) =>
  jwt.sign(
    data,
    { key: PRIVATE_KEY, passphrase: PRIVATE_KEY_PASSPHRASE },
    {
      algorithm: "RS256",
      ...(data[TOKEN_KEY_TYPE] === TOKEN_TYPE_SESSION ? { expiresIn } : undefined),
    },
  );
