import config from "config";
import crypto from "crypto";

const passwordHashSecrets = config.get("users.passwordHashSecrets");

const createHash = (text) => crypto.createHash("sha256").update(text).digest("hex");

export default (secret) =>
  passwordHashSecrets.reduce((hash, secretPart) => createHash(`${secretPart}${hash}`), secret);
