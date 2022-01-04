import jwt from "jsonwebtoken";

import { isEmptyString } from "../utils/isNonEmptyString.js";

import { PUBLIC_KEY } from "./keys.js";

const decodeToken = (encodedToken) =>
  new Promise((resolve, reject) => {
    if (isEmptyString(encodedToken)) {
      reject();
      return;
    }

    jwt.verify(encodedToken, PUBLIC_KEY, { algorithms: ["RS256"] }, (err, payload) => {
      if (err) {
        reject();
      } else {
        resolve(payload, encodedToken);
      }
    });
  });

export default decodeToken;
