import { isNonEmptyString } from "../../utils/isNonEmptyString.js";

import decodeToken from "../decodeToken.js";

const tokenCache = new Set();

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    if (isNonEmptyString(token) && tokenCache.has(token)) {
      decodeToken(token)
        .then(() => resolve(token))
        .catch(() => {
          tokenCache.delete(token);
          reject();
        });
    } else {
      reject();
    }
  });

export const storeToken = (token) =>
  new Promise((resolve, reject) => {
    if (isNonEmptyString(token)) {
      tokenCache.add(token);
      resolve(token);
    } else {
      reject();
    }
  });

export const destroyToken = (token) =>
  new Promise((resolve, reject) => {
    if (isNonEmptyString(token)) {
      tokenCache.delete(token);
      resolve();
    } else {
      reject();
    }
  });

export const destroyAllTokens = () =>
  new Promise((resolve) => {
    tokenCache.clear();
    resolve();
  });
