import makeSessionToken from "./createToken/makeSessionToken.js";
import signToken from "./createToken/signToken.js";
import sendJwt from "./sendJwt.js";

export default async function (req, res) {
  try {
    if (!req.token) {
      throw "no token found in request";
    }

    // TODO verify and update lastLoginTime

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
