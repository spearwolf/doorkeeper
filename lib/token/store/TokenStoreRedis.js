import md5 from "blueimp-md5";
import redis from "redis";

import { isNonEmptyString } from "../../utils/isNonEmptyString.js";

import decodeToken from "../decodeToken.js";

const TOKEN_NAMESPACE = "token";

export default class TokenStoreRedis {
  constructor(redisConfig, keyNamespace = "doorkeeper") {
    this.client = redis.createClient(redisConfig);
    this.keyNamespace = keyNamespace;
  }

  get tokenKeyNamespace() {
    return `${this.keyNamespace}.${TOKEN_NAMESPACE}`;
  }

  constructTokenKey(token) {
    const tokenMd5 = md5(token);
    return `${this.tokenKeyNamespace}.${tokenMd5}`;
  }

  verifyToken(token) {
    return new Promise((resolve, reject) => {
      if (isNonEmptyString(token)) {
        const tokenKey = this.constructTokenKey(token);
        this.client.sismember(tokenKey, token, function (err, isMember) {
          if (!err && isMember) {
            decodeToken(token)
              .then(() => resolve(token))
              .catch(() => {
                this.destroyToken(token);
                reject();
              });
          } else {
            reject();
          }
        });
      } else {
        reject();
      }
    });
  }

  storeToken(token) {
    return new Promise((resolve, reject) => {
      if (isNonEmptyString(token)) {
        this.client.sadd(this.constructTokenKey(token), token, (err) => {
          if (err) reject();
          else resolve(token);
        });
      } else {
        reject();
      }
    });
  }

  destroyToken(token) {
    return new Promise((resolve, reject) => {
      if (isNonEmptyString(token)) {
        this.client.srem(this.constructTokenKey(token), token, resolve);
      } else {
        reject();
      }
    });
  }

  destroyAllTokens() {
    return new Promise((resolve, reject) => {
      this.client.keys(`${this.tokenKeyNamespace}.*`, (err, keys) => {
        if (err) reject();
        else {
          this.client.del(keys, (err1) => {
            if (err1) reject();
            else resolve();
          });
        }
      });
    });
  }

  shutdown() {
    this.client.quit();
  }
}
