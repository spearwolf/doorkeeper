import config from "config";
import { SECRET_KEYS, TOKEN_KEY_TYPE, TOKEN_TYPE_LOGIN } from "./constants.js";

const commonLoginTokenData = { iss: config.get("jwt.iss"), [TOKEN_KEY_TYPE]: TOKEN_TYPE_LOGIN };

const asUserWithoutSecrets = (user) =>
  Object.fromEntries(Object.entries(user).filter(([key]) => !SECRET_KEYS.includes(key)));

export default (userInfo) => ({
  ...asUserWithoutSecrets(userInfo),
  ...commonLoginTokenData,
});
