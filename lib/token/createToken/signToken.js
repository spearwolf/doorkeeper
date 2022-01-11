import jwt from "jsonwebtoken";
import { PRIVATE_KEY, PRIVATE_KEY_PASSPHRASE } from "../keys.js";

export default (data) =>
  jwt.sign(data, { key: PRIVATE_KEY, passphrase: PRIVATE_KEY_PASSPHRASE }, { algorithm: "RS256" });
