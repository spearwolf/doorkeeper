import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../keys.js";

export default (data) => jwt.sign(data, PRIVATE_KEY, { algorithm: "RS256" });
