import { isNonEmptyString } from "../../utils/isNonEmptyString.js";
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

  // TODO this is the place where you should integrate your custom user provider logic
  return undefined;
};

export default (login, password) => verifyUserInfo(login, authorize(login, password));
