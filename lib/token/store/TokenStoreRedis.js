import redis from "redis";
import crypto from "crypto";

import { isEmptyString } from "../../utils/isNonEmptyString.js";

import decodeToken from "../decodeToken.js";

export default class TokenStoreRedis {
  constructor(redisConfig, namespace, tokenNamespace, tokenTimeToLiveInSeconds) {
    this.namespace = namespace;
    this.tokenNamespace = tokenNamespace;
    this.tokenTimeToLiveInSeconds = tokenTimeToLiveInSeconds;

    this.client = redis.createClient(redisConfig);

    // this.client.on("connect", () => console.log("doorkeeper: redis client connected to the server :)"));
    // this.client.on("ready", () => console.log("doorkeeper: redis client is ready."));
    // this.client.on("end", () => console.log("doorkeeper: redis client disconnected!"));
    this.client.on("error", (err) => console.error("doorkeeper: redis client error;", err));
    // this.client.on("reconnecting", () => console.log("doorkeeper: redis client reconnecting..."));
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
      console.error("redis token store: destroy token error;", err);
    }
  }

  async destroyAllTokens() {
    const keys = await this.client.keys(`${this.#tokenKeysNamespace}.*`);

    if (Array.isArray(keys) && keys.length > 0) {
      try {
        await this.client.del(keys);
      } catch (err) {
        console.error("redis token store: destroy all tokens error;", err);
      }
    }
  }
}
