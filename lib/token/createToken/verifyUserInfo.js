import { TOKEN_KEY_DISPLAY_NAME, TOKEN_KEY_UID } from "./constants.js";

export default (login, userInfo) => {
  const sub = `${login || ""}`.trim();

  userInfo.sub = login;

  if (sub.length < 2) {
    console.error(`doorkeeper: ERROR user-info ${JSON.stringify(userInfo)} has invalid :sub`);
    throw "invalid userInfo";
  }

  if (!(TOKEN_KEY_UID in userInfo)) {
    console.error(
      `doorkeeper: ERROR user-info ${JSON.stringify(userInfo)} has no :${TOKEN_KEY_UID} property`,
    );
    throw "invalid userInfo";
  }

  if (!(TOKEN_KEY_DISPLAY_NAME in userInfo)) {
    console.error(
      `doorkeeper: WARNING user '${JSON.stringify(
        userInfo,
      )}' has no :${TOKEN_KEY_DISPLAY_NAME} property (:sub is used instead)`,
    );
    userInfo[TOKEN_KEY_DISPLAY_NAME] = sub;
  }

  return userInfo;
};
