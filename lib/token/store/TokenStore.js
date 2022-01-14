import config from "config";
import * as InMemoryStore from "./in-memory/InMemoryStore.js";
import TokenStoreRedis from "./redis/TokenStoreRedis.js";
import logger from "../../logger.js";

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
      const userNamespace = config.get("redis.user.namespace");
      const tokenConfig = config.get("token.login");

      logger.info(
        { redisStoreConfig: { namespace, tokenNamespace, userNamespace, tokenConfig } },
        `connect to redis token store at ${getPublicReadableHostInfo(redisClientConfig)}`,
      );

      store = new TokenStoreRedis(
        redisClientConfig,
        namespace,
        tokenNamespace,
        userNamespace,
        tokenConfig,
      );
    } catch (err) {
      logger.error({ err });
      throw "redis setup trouble";
    }
  } else if (tokenStoreConfig === "in-memory") {
    logger.info("using in-memory token store");
    store = InMemoryStore;
  } else {
    logger.error(
      `unknown tokenStore="${tokenStoreConfig}", allowed values are ["redis", "in-memory"]`,
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
      logger.error(
        { err },
        `${methodName}(${args.map((arg) => JSON.stringify(arg)).join(", ")}) failed`,
      );
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
