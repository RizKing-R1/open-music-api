import { createClient } from "redis";
import config from "../../utils/config.js";

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on("error", (error) => {
      console.error(error);
    });

    this._client.connect();

    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.delete = this.delete.bind(this);
  }

  async set(key, value, expirationInSeconds = 1800) {
    try {
      await this._client.set(key, value, {
        EX: expirationInSeconds,
      });
    } catch (error) {
      console.error(`CacheService set error: ${error.message}`);
    }
  }

  async get(key) {
    try {
      const result = await this._client.get(key);

      if (result === null) {
        throw new Error("Cache miss");
      }

      return result;
    } catch (error) {
      throw new Error("Cache miss");
    }
  }

  async delete(key) {
    try {
      await this._client.del(key);
    } catch (error) {
      console.error(`CacheService delete error: ${error.message}`);
    }
  }
}

export default CacheService;
