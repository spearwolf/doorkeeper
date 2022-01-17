import crypto from "crypto";
import redis from "redis";
import parentLogger from "../../../logger.js";
import { isEmptyString } from "../../../utils/isNonEmptyString.js";

const logger = parentLogger.child({ tokenStore: "redis" });

export default class TokenStoreRedis {
  constructor(redisConfig, namespace, tokenNamespace, userNamespace, tokenConfig) {
    this.namespace = namespace;
    this.tokenNamespace = tokenNamespace;
    this.userNamespace = userNamespace;

    this.tokenTimeToLiveInSeconds = tokenConfig.ttl;
    this.lastLoginExpire = tokenConfig.lastLoginExpire;

    this.client = redis.createClient(redisConfig);

    // "connect"
    // "ready"
    // "end"
    this.client.on("error", (err) => logger.error({ err }, "client connection error"));
    // "reconnecting"
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.quit();
  }

  get #tokenKeysNamespace() {
    return `${this.namespace}.${this.tokenNamespace}`;
  }

  #constructTokenKey = (token) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    return `${this.#tokenKeysNamespace}.${tokenHash}`;
  };

  get #lastLoginTimeKeyNamespace() {
    return `${this.namespace}.${this.userNamespace}.lastLoginTime`;
  }

  #constructLastLoginTimeKey = (uid) => {
    return `${this.#lastLoginTimeKeyNamespace}.${uid}`;
  };

  async verifyToken(token) {
    if (isEmptyString(token)) {
      throw "token is empty";
    }

    const tokenKey = this.#constructTokenKey(token);
    const tokenFromStore = await this.client.get(tokenKey);

    if (tokenFromStore == null || token !== tokenFromStore) {
      throw "unknown token";
    }
  }

  async storeToken(token) {
    if (isEmptyString(token)) {
      throw "token is empty";
    }

    const tokenKey = this.#constructTokenKey(token);
    await this.client.set(tokenKey, token, { EX: this.tokenTimeToLiveInSeconds });

    return token;
  }

  async saveLastLoginTime(uid, time) {
    const key = this.#constructLastLoginTimeKey(uid);
    await this.client.set(key, time, { EX: this.lastLoginExpire });
  }

  async verifyAndUpdateLastLoginTime(uid, time) {
    const key = this.#constructLastLoginTimeKey(uid);
    const ok = await this.client.set(key, time, { EX: this.lastLoginExpire, XX: true });
    if (ok !== "OK") {
      throw "no last login";
    }
  }

  async destroyToken(token) {
    if (isEmptyString(token)) {
      throw "token is empty";
    }

    try {
      await this.client.del(this.#constructTokenKey(token));
    } catch (err) {
      logger.error({ err }, "destroy token trouble");
    }
  }

  async destroyAllTokens() {
    const [tokenKeys, lastLoginKeys] = await Promise.all([
      this.client.keys(`${this.#tokenKeysNamespace}.*`),
      this.client.keys(`${this.#lastLoginTimeKeyNamespace}.*`),
    ]);

    const keys = [...tokenKeys, ...lastLoginKeys];

    if (Array.isArray(keys) && keys.length > 0) {
      try {
        await this.client.del(keys);
      } catch (err) {
        logger.error({ err }, "destroy all tokens trouble");
      }
    }
  }
}
