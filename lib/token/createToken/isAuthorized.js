import config from "config";
import fs from "fs";
import { isNonEmptyString } from "../../utils/isNonEmptyString.js";

const STATIC_USERS_FILE = config.get("staticUsersFile");

let staticUsers = undefined;

const findLocalUserByName = (name) => {
  if (!isNonEmptyString(name)) {
    return;
  }

  if (STATIC_USERS_FILE && staticUsers == null) {
    staticUsers = new Map();
    try {
      const users = JSON.parse(fs.readFileSync(STATIC_USERS_FILE));
      for (const [name, userData] of Object.entries(users)) {
        staticUsers.set(name, userData);
      }
    } catch (err) {
      console.error("doorkeeper: could not load staticUsersFile:", STATIC_USERS_FILE, err);
    }
  }

  return staticUsers.get(name);
};

// maybe a little too simple - but for now that's enough :)
export default (login, password) => {
  const user = findLocalUserByName(login);
  if (user) {
    return user.secret === password;
  }

  return (
    typeof login === "string" &&
    typeof password === "string" &&
    login.length > 2 &&
    password.length &&
    password.indexOf(login) !== -1
  );
};
