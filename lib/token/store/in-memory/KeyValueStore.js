export class KeyValueStore {
  #store = new Map();

  get(key) {
    const data = this.#store.get(key);
    if (data !== undefined) {
      if (data.expireAt) {
        if (data.expireAt <= Date.now()) {
          this.#store.delete(key);
          return undefined;
        }
      }
      return data.value;
    }
    return undefined;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  set(key, value, expireIn = 0) {
    if (value === undefined) {
      this.#store.delete(key);
      return;
    }
    const expireAt = expireIn > 0 ? Math.round(Date.now() + expireIn * 1000) : undefined;
    this.#store.set(key, {
      value,
      expireAt,
    });
  }

  delete(key) {
    this.#store.delete(key);
  }

  deleteKeys(keyPrefix) {
    Array.from(this.#store.keys())
      .filter((key) => `${key}`.startsWith(keyPrefix))
      .forEach((key) => this.#store.delete(key));
  }
}
