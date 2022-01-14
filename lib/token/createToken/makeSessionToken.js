import config from "config";
import { SECRET_KEYS, TOKEN_KEY_TYPE, TOKEN_TYPE_SESSION } from "./constants.js";

const commonSessionTokenData = { iss: config.get("jwt.iss"), [TOKEN_KEY_TYPE]: TOKEN_TYPE_SESSION };

const asUserWithoutSecrets = (user) =>
  Object.fromEntries(Object.entries(user).filter(([key]) => !SECRET_KEYS.includes(key)));

export default (userInfo) => ({
  ...asUserWithoutSecrets(userInfo),
  ...commonSessionTokenData,
});
