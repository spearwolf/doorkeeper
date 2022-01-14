import config from "config";
import conditionsMatch from "../utils/conditionsMatch.js";
import { isNonEmptyString } from "../utils/isNonEmptyString.js";
import { TOKEN_KEY_TYPE, TOKEN_TYPE_LOGIN, TOKEN_TYPE_SESSION } from "./createToken/constants.js";
import { verifyToken } from "./store/index.js";
import decodeToken from "./decodeToken.js";

const authKey = config.get("authKey");
const jwtIssuer = config.get("jwt.iss");

function fail(res) {
  res.sendStatus(400);
}

const verifyTokenAndUpdateRequest = async (req, token, conditions) => {
  const tokenContent = await decodeToken(token);

  if (tokenContent.iss !== jwtIssuer) {
    throw "this is not mine";
  }

  if (!conditionsMatch(tokenContent, conditions)) {
    throw "conditions do not match";
  }

  if (tokenContent[TOKEN_KEY_TYPE] === TOKEN_TYPE_LOGIN) {
    await verifyToken(token);
  }

  req.token = tokenContent;
  req.encodedToken = token;
};

const verify =
  (...tokenConditions) =>
  async (req, res, next) => {
    const auth = req.get(authKey);

    if (!(isNonEmptyString(auth) && auth.startsWith("Bearer"))) {
      fail(res);
      return;
    }

    const conditions = Object.assign({}, ...tokenConditions);
    try {
      await verifyTokenAndUpdateRequest(req, auth.split(" ")[1], conditions);
      next();
    } catch {
      fail(res);
    }
  };

export default verify;

export const verifyLoginToken = (conditions = undefined) =>
  verify(conditions, { [TOKEN_KEY_TYPE]: TOKEN_TYPE_LOGIN });

export const verifySessionToken = (conditions = undefined) =>
  verify(conditions, { [TOKEN_KEY_TYPE]: TOKEN_TYPE_SESSION });
