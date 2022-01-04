import makeLoginToken from "./createToken/makeLoginToken.js";
import isAuthorized from "./createToken/isAuthorized.js";
import signToken from "./createToken/signToken.js";
import { storeToken } from "./store/index.js";

function fail(res) {
  res.sendStatus(400);
}

export default function (req, res) {
  const login = req.body?.login?.trim();
  const password = req.body?.password?.trim();

  if (isAuthorized(login, password)) {
    storeToken(signToken(makeLoginToken(login)))
      .then((token) => {
        res.setHeader("Content-Type", "application/jwt");
        res.send(token);
      })
      .catch(() => {
        fail(res);
      });
  } else {
    fail(res);
  }
}
