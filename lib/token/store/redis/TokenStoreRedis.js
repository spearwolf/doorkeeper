import crypto from "crypto";
import redis from "redis";
import { isEmptyString } from "../../../utils/isNonEmptyString.js";
import decodeToken from "../../decodeToken.js";
import parentLogger from "../../../logger.js";

const logger = parentLogger.child({ tokenStore: "redis" });

export default class TokenStoreRedis {
  constructor(redisConfig, namespace, tokenNamespace, tokenTimeToLiveInSeconds) {
    this.namespace = namespace;
    this.tokenNamespace = tokenNamespace;
    this.tokenTimeToLiveInSeconds = tokenTimeToLiveInSeconds;

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

  async verifyToken(token) {
    if (isEmptyString(token)) {
      throw "token is empty";
    }

    const tokenKey = this.#constructTokenKey(token);
    const tokenFromStore = await this.client.get(tokenKey);

    if (tokenFromStore != null && tokenFromStore === token) {
      return decodeToken(token);
    }

    throw "unknown token";
  }

  async storeToken(token) {
    if (isEmptyString(token)) {
      throw "token is empty";
    }

    const tokenKey = this.#constructTokenKey(token);
    await this.client.set(tokenKey, token, "EX", this.tokenTimeToLiveInSeconds);

    return token;
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
    const keys = await this.client.keys(`${this.#tokenKeysNamespace}.*`);

    if (Array.isArray(keys) && keys.length > 0) {
      try {
        await this.client.del(keys);
      } catch (err) {
        logger.error({ err }, "destroy all tokens trouble");
      }
    }
  }
}
