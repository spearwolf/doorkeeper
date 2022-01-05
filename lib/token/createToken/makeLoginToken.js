import config from "config";

const commonLoginTokenData = { iss: config.get("jwt.iss"), toktyp: "login" };

const SECRET_KEYS = ["secret", "password", "pw", "passphrase"];

const asUserWithoutSecrets = (user) => Object.fromEntries(Object.entries(user).filter(([key]) => !SECRET_KEYS.includes(key)));

export default (sub, userInfo) => ({ sub, ...asUserWithoutSecrets(userInfo), ...commonLoginTokenData });
