import config from "config";
import fs from "fs";
import { isNonEmptyString } from "../utils/isNonEmptyString.js";
import createHashFromSecret from "./createHashFromSecret.js";
import parentLogger from "../logger.js";

const logger = parentLogger.child({ tokenStore: "redis" });

const STATIC_USERS_FILE = config.get("users.staticUsersFile");

let staticUsers = undefined;

const loadStaticUsers = () => {
  staticUsers = new Map();
  try {
    const users = JSON.parse(fs.readFileSync(STATIC_USERS_FILE));
    for (const [name, userData] of Object.entries(users)) {
      staticUsers.set(name, userData);
    }
  } catch (err) {
    logger.error({ err }, "could not load staticUsersFile: %s", STATIC_USERS_FILE);
  }
};

const findLocalUserByName = (name) => {
  if (!isNonEmptyString(name)) {
    return;
  }

  if (STATIC_USERS_FILE && staticUsers == null) {
    loadStaticUsers();
  }

  return staticUsers.get(name);
};

export const findLocalUserByNameAndSecret = (name, secret) => {
  const user = findLocalUserByName(name);

  if (user != null && isNonEmptyString(secret)) {
    if (user.secret === createHashFromSecret(secret)) {
      return user;
    }
    throw "bad secret";
  }

  return undefined;
};
