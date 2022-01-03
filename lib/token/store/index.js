import { callTokenStore } from "./TokenStore.js";

export const verifyToken = async (...args) => callTokenStore("verifyToken", ...args);
export const storeToken = async (...args) => callTokenStore("storeToken", ...args);
export const destroyToken = async (...args) => callTokenStore("destroyToken", ...args);

export const destroyAllTokens = async () => callTokenStore("destroyAllTokens");
