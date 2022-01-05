import authorize from "./createToken/authorize.js";
import makeLoginToken from "./createToken/makeLoginToken.js";
import signToken from "./createToken/signToken.js";
import { storeToken } from "./store/index.js";

/**
 * The **login api**
 *
 * Login can be done by a _login-id_ and _password_.
 * TODO: Alternatively a _login jwt token_ can be used.
 *
 * The client gets a _login jwt token_ back in response.
 *
 * If the login is not successful, a `400 Bad Request` response is sent to the client.
 */
export default async function (req, res) {
  const login = req.body?.login?.trim();
  const password = req.body?.password?.trim();

  try {
    const userInfo = authorize(login, password);
    if (!userInfo) {
      throw "authorize failed";
    }

    const token = await storeToken(signToken(makeLoginToken(login, userInfo)));

    res.setHeader("Content-Type", "application/jwt");
    res.send(token);
  } catch {
    res.sendStatus(400);
  }
}
