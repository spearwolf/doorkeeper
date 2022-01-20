import config from "config";
import crypto from "crypto";
import { isNonEmptyString } from "../../../utils/isNonEmptyString.js";
import { KeyValueStore } from "./KeyValueStore.js";

const tokenConfig = config.get("token.login");
const store = new KeyValueStore();

const getTokenKey = (token) => {
  const tokenHash = token ? crypto.createHash("sha256").update(token).digest("hex") : "";
  return `token.${tokenHash}`;
};

const getLastLoginTimeKey = (uid) => `lastLoginTime.${uid}`;

export async function verifyToken(token) {
  if (!isNonEmptyString(token)) {
    throw "blank token";
  }

  const token0 = store.get(getTokenKey(token));

  if (token0 !== token) {
    throw "token content mismatch";
  }
}

export async function storeToken(token) {
  if (!isNonEmptyString(token)) {
    throw "blank token";
  }
  store.set(getTokenKey(token), token, tokenConfig.ttl);
  return Promise.resolve(token);
}

export async function saveLastLoginTime(uid, time) {
  const key = getLastLoginTimeKey(uid);
  store.set(key, time, tokenConfig.lastLoginExpire);
}

export async function verifyAndUpdateLastLoginTime(uid, time) {
  const key = getLastLoginTimeKey(uid);
  if (store.has(key)) {
    store.set(key, time, tokenConfig.lastLoginExpire);
  } else {
    throw "no last login";
  }
}

export async function destroyToken(token) {
  if (!isNonEmptyString(token)) {
    throw "blank token";
  }
  store.delete(getTokenKey(token));
}

export async function destroyAllTokens() {
  store.deleteKeys(getTokenKey());
}
