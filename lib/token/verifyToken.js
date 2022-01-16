import config from "config";
import conditionsMatch from "../utils/conditionsMatch.js";
import { isNonEmptyString } from "../utils/isNonEmptyString.js";
import decodeToken from "./decodeToken.js";
import { TOKEN_KEY_TYPE, TOKEN_TYPE_LOGIN, TOKEN_TYPE_SESSION } from "./generate/constants.js";
import { verifyToken as verifyTokenInStore } from "./store/index.js";

const AUTHORIZATION = config.get("authKey");
const JWT_ISSUER = config.get("jwt.iss");

function fail(res) {
  res.sendStatus(400);
}

const verifyTokenAndUpdateRequest = async (req, token, conditions) => {
  const tokenContent = await decodeToken(token);

  if (tokenContent.iss !== JWT_ISSUER) {
    throw "this is not mine";
  }

  if (!conditionsMatch(tokenContent, conditions)) {
    throw "conditions do not match";
  }

  if (tokenContent[TOKEN_KEY_TYPE] === TOKEN_TYPE_LOGIN) {
    await verifyTokenInStore(token);
  }

  req.token = tokenContent;
  req.encodedToken = token;
};

const verify = (...tokenConditions) => {
  const conditions = Object.assign({}, ...tokenConditions);

  return async (req, res, next) => {
    const auth = req.get(AUTHORIZATION);

    if (!(isNonEmptyString(auth) && auth.startsWith("Bearer"))) {
      fail(res);
      return;
    }

    try {
      await verifyTokenAndUpdateRequest(req, auth.split(" ")[1], conditions);
      next();
    } catch {
      fail(res);
    }
  };
};

export default verify;

export const verifyLoginToken = (conditions = undefined) =>
  verify(conditions, { [TOKEN_KEY_TYPE]: TOKEN_TYPE_LOGIN });

export const verifySessionToken = (conditions = undefined) =>
  verify(conditions, { [TOKEN_KEY_TYPE]: TOKEN_TYPE_SESSION });
