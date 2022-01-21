import crypto from "crypto";
import { isNonEmptyString } from "../../utils/isNonEmptyString.js";
import { TOKEN_KEY_DISPLAY_NAME, TOKEN_KEY_UID } from "./constants.js";
import { findLocalUserByNameAndSecret } from "../../users/findLocalUser.js";
import verifyUserInfo from "./verifyUserInfo.js";

const authorize = (login, password) => {
  if (!(isNonEmptyString(login) && isNonEmptyString(password))) {
    throw "bad request input data";
  }

  const userInfo = findLocalUserByNameAndSecret(login, password);

  if (userInfo) {
    return userInfo;
  }

  // XXX maybe a little too simple - but for now that's enough :)
  if (login.length > 2 && password.length > 0 && password.indexOf(login) !== -1) {
    return { [TOKEN_KEY_DISPLAY_NAME]: login, [TOKEN_KEY_UID]: crypto.randomUUID() };
  }
};

export default (login, password) => verifyUserInfo(login, authorize(login, password));
