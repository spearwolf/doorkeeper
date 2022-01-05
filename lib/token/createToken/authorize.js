import { isNonEmptyString } from "../../utils/isNonEmptyString.js";
import { findLocalUserByNameAndSecret } from "./findLocalUser.js";

export default (login, password) => {
  if (!(isNonEmptyString(login) && isNonEmptyString(password))) {
    throw "bad request input data";
  }

  const userInfo = findLocalUserByNameAndSecret(login, password);
  if (userInfo) {
    return userInfo;
  }

  // maybe a little too simple - but for now that's enough :)
  if (login.length > 2 && password.length > 0 && password.indexOf(login) !== -1) {
    return { sub: login };
  }
};
