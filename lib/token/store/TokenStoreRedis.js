import md5 from "blueimp-md5";
import redis from "redis";

import { isEmptyString } from "../../utils/isNonEmptyString.js";

import decodeToken from "../decodeToken.js";

export default class TokenStoreRedis {
  constructor(redisConfig, keyNamespace = "doorkeeper") {
    this.keyNamespace = keyNamespace;

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

  get tokenKeyNamespace() {
    return `${this.keyNamespace}.token`;
  }

  constructTokenKey(token) {
    const tokenMd5 = md5(token);
    return `${this.tokenKeyNamespace}.${tokenMd5}`;
  }

  async verifyToken(token) {
    if (isEmptyString(token)) {
      throw "token is empty";
    }

    const tokenKey = this.constructTokenKey(token);
    const isKnownToken = await this.client.SISMEMBER(tokenKey, token);

    if (isKnownToken) {
      try {
        return decodeToken(token);
      } catch (err) {
        try {
          await this.destroyToken(token);
        } finally {
          throw err;
        }
      }
    } else {
      throw "unknown token";
    }
  }

  async storeToken(token) {
    if (isEmptyString(token)) {
      throw "token is empty";
    }

    const tokenKey = this.constructTokenKey(token);

    await this.client.SADD(tokenKey, token);

    return token;
  }

  async destroyToken(token) {
    if (isEmptyString(token)) {
      throw "token is empty";
    }

    const tokenKey = this.constructTokenKey(token);

    try {
      await this.client.SREM(tokenKey, token);
    } catch (err) {
      console.error("redis token store: destroy token error;", err);
    }
  }

  async destroyAllTokens() {
    const keys = await this.client.keys(`${this.tokenKeyNamespace}.*`);

    if (Array.isArray(keys) && keys.length > 0) {
      try {
        await this.client.del(keys);
      } catch (err) {
        console.error("redis token store: destroy all tokens error;", err);
      }
    }
  }
}
