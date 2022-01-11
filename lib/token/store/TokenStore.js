import config from "config";
import * as InMemoryStore from "./InMemoryStore.js";
import TokenStoreRedis from "./TokenStoreRedis.js";

const getPublicReadableHostInfo = (redisClientConfig) =>
  redisClientConfig.url?.replace(/^(rediss?):\/\/([^:]*):[^@]*@/, "$1://$2:*@") ||
  `${redisClientConfig.socket?.host || "localhost"}:${redisClientConfig.socket?.port || "6379"}`;

function createTokenStore() {
  const tokenStoreConfig = config.get("tokenStore");

  let store = null;

  if (tokenStoreConfig === "redis") {
    try {
      const redisClientConfig = config.get("redis.client") || {
        host: "127.0.0.1",
      };

      const namespace = config.get("redis.namespace");
      const tokenNamespace = config.get("redis.token.namespace");
      const tokenTimeToLiveInSeconds = config.get("redis.token.timeToLiveInSeconds");

      console.log(
        `doorkeeper: connect to redis token store at ${getPublicReadableHostInfo(
          redisClientConfig,
        )}`,
        JSON.stringify({ namespace, tokenNamespace, tokenTimeToLiveInSeconds }),
      );

      store = new TokenStoreRedis(
        redisClientConfig,
        namespace,
        tokenNamespace,
        tokenTimeToLiveInSeconds,
      );
    } catch (err) {
      console.error("doorkeeper: ERROR redis setup trouble:", err);
      throw "redis setup trouble";
    }
  } else if (tokenStoreConfig === "in-memory") {
    console.log("doorkeeper: using in-memory token store");
    store = InMemoryStore;
  } else {
    console.error(
      `Error: unknown tokenStore="${tokenStoreConfig}", allowed values are ["redis", "in-memory"]`,
    );
  }

  return store;
}

let tokenStoreInstance = undefined;

export const getTokenStore = async () => {
  if (!tokenStoreInstance) {
    tokenStoreInstance = createTokenStore();

    if (tokenStoreInstance.connect) {
      await tokenStoreInstance.connect();
    }

    if (config.get("destroyAllTokensAtStartup") && tokenStoreInstance.destroyAllTokens) {
      await tokenStoreInstance.destroyAllTokens();
    }
  }

  return tokenStoreInstance;
};

export const callTokenStore = async (methodName, ...args) => {
  const tokenStore = await getTokenStore();
  if (typeof tokenStore[methodName] === "function") {
    try {
      return tokenStore[methodName](...args);
    } catch (err) {
      console.error(`doorkeeper: ${methodName}(`, ...args, ") error;", err);
      throw err;
    }
  }
};

export const disconnectTokenStore = async () => {
  if (tokenStoreInstance) {
    await callTokenStore("disconnect");
    // eslint-disable-next-line require-atomic-updates
    tokenStoreInstance = undefined;
  }
};
