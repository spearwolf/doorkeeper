import config from "config";

import * as InMemoryStore from "./InMemoryStore.js";
import TokenStoreRedis from "./TokenStoreRedis.js";

function createTokenStore() {
  const tokenStore = config.get("tokenStore");
  let store = null;
  if (tokenStore === "redis") {
    const redisClientConfig = config.get("redis.client") || {
      host: "127.0.0.1",
    };
    const redisKeyNamespace = config.get("redis.keyNamespace");
    console.log(
      `doorkeeper: using redis token store at ${
        redisClientConfig.host || redisClientConfig
      }, key-namespace: ${redisKeyNamespace}`,
    );
    store = new TokenStoreRedis(redisClientConfig, redisKeyNamespace);
  } else if (tokenStore === "in-memory") {
    console.log("doorkeeper: using in-memory token store");
    store = InMemoryStore;
  } else {
    console.error(`Error: unknown tokenStore="${tokenStore}", allowed values are ["redis", "in-memory"]`);
  }
  if (config.get("destroyAllTokensAtStartup")) {
    if (store.destroyAllTokens) store.destroyAllTokens();
  }
  return store;
}

function getTokenStoreImpl() {
  let impl = getTokenStoreImpl.instance;
  if (!impl) {
    getTokenStoreImpl.instance = createTokenStore();
    impl = getTokenStoreImpl.instance;
  }
  return impl;
}

export function verifyToken(token) {
  return getTokenStoreImpl().verifyToken(token);
}

export function storeToken(token) {
  return getTokenStoreImpl().storeToken(token);
}

export function destroyToken(token) {
  return getTokenStoreImpl().destroyToken(token);
}

export function destroyAllTokens() {
  const store = getTokenStoreImpl();
  return store.destroyAllTokens ? store.destroyAllTokens() : Promise.resolve();
}
