import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = () => {
  try {
    const redisURI = process.env.REDIS_URI; // Fixed typo here

    if (redisURI) {
      console.log("Connecting to Redis...");
      return redisURI; // Correctly return the URI to be used in Redis connection
    }

    throw new Error("Redis Connection Failed: URI not found");
  } catch (error:any) {
    console.error("Error in redisClient:", error.message);
    throw error; // Re-throw error to be caught in the higher scope
  }
};

// Pass the redisURI correctly to the Redis constructor
export const redis = new Redis(redisClient());
