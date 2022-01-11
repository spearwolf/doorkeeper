import config from "config";
import fs from "fs";
import { isNonEmptyString } from "../../utils/isNonEmptyString.js";

const STATIC_USERS_FILE = config.get("staticUsersFile");

let staticUsers = undefined;

const loadStaticUsers = () => {
  staticUsers = new Map();
  try {
    const users = JSON.parse(fs.readFileSync(STATIC_USERS_FILE));
    for (const [name, userData] of Object.entries(users)) {
      staticUsers.set(name, userData);
    }
  } catch (err) {
    console.error("doorkeeper: ERROR could not load staticUsersFile:", STATIC_USERS_FILE, err);
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
    if (user.secret === secret) {
      return user;
    }
    throw "bad secret";
  }

  return undefined;
};
