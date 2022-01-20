import { callTokenStore } from "./TokenStore.js";

export const storeToken = async (...args) => callTokenStore("storeToken", ...args);
export const verifyToken = async (...args) => callTokenStore("verifyToken", ...args);

export const saveLastLoginTime = async (...args) => callTokenStore("saveLastLoginTime", ...args);
export const verifyAndUpdateLastLoginTime = async (...args) =>
  callTokenStore("verifyAndUpdateLastLoginTime", ...args);

export const destroyToken = async (...args) => callTokenStore("destroyToken", ...args);
export const destroyAllTokens = async () => callTokenStore("destroyAllTokens");
