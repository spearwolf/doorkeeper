import logger from "../../logger.js";
import { TOKEN_KEY_DISPLAY_NAME, TOKEN_KEY_UID } from "./constants.js";

export default (login, userInfo) => {
  const sub = `${login || ""}`.trim();

  userInfo.sub = login;

  if (sub.length < 2) {
    logger.error({ userInfo }, "user-info has invalid :sub");
    throw "invalid userInfo";
  }

  if (!(TOKEN_KEY_UID in userInfo)) {
    logger.error({ userInfo }, "user-info has no :%s property", userInfo, TOKEN_KEY_UID);
    throw "invalid userInfo";
  }

  if (!(TOKEN_KEY_DISPLAY_NAME in userInfo)) {
    logger.warn(
      { userInfo },
      "user-info has no :%s property (:sub is used instead)",
      TOKEN_KEY_DISPLAY_NAME,
    );
    userInfo[TOKEN_KEY_DISPLAY_NAME] = sub;
  }

  return userInfo;
};
