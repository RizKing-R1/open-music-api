import { createClient } from "redis";

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on("error", (error) => {
      console.error(error);
    });

    this._client.connect();
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
