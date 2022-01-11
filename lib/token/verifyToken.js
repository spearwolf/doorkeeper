import config from "config";
import conditionsMatch from "../utils/conditionsMatch.js";
import { isNonEmptyString } from "../utils/isNonEmptyString.js";
import { TOKEN_KEY_TYPE, TOKEN_TYPE_LOGIN, TOKEN_TYPE_SESSION } from "./createToken/constants.js";
import { verifyToken } from "./store/index.js";

const authKey = config.get("authKey");
const jwtIssuer = config.get("jwt.iss");

function fail(res) {
  res.sendStatus(400);
}

const verifyTokenAndUpdateRequest = async (req, token, conditions) => {
  const tokenContent = await verifyToken(token);

  if (tokenContent.iss !== jwtIssuer) {
    throw "this is not mine";
  }

  if (!conditionsMatch(tokenContent, conditions)) {
    throw "conditions do not match";
  }

  req.token = tokenContent;
  req.encodedToken = token;
};

export default (conditions = undefined) =>
  async (req, res, next) => {
    const auth = req.get(authKey);

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

export const verifyLoginToken = (conditions = undefined) =>
  verifyToken({ ...conditions, [TOKEN_KEY_TYPE]: TOKEN_TYPE_LOGIN });

export const verifySessionToken = (conditions = undefined) =>
  verifyToken({ ...conditions, [TOKEN_KEY_TYPE]: TOKEN_TYPE_SESSION });
