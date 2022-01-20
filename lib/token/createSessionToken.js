import { isNonEmptyString } from "../utils/isNonEmptyString.js";
import sendJwt from "../utils/sendJwt.js";
import makeSessionToken from "./generate/makeSessionToken.js";
import signToken from "./generate/signToken.js";
import isLoginToken from "./isLoginToken.js";
import { verifyAndUpdateLastLoginTime } from "./store/index.js";

export default async function (req, res) {
  try {
    if (!req.token) {
      throw "no token found in request";
    }

    if (isLoginToken(req.token) && isNonEmptyString(req.token.uid)) {
      await verifyAndUpdateLastLoginTime(req.token.uid, Date.now());
    } else {
      throw "invalid login token";
    }

    const sessionToken = makeSessionToken({
      sub: req.token.sub,
      uid: req.token.uid,
      roles: req.token.roles,
      displayName: req.token.displayName,
    });

    sendJwt(res, signToken(sessionToken));
  } catch {
    res.sendStatus(400);
  }
}
