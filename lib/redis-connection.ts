import { ConnectionOptions } from "bullmq";

export const redisConnection: ConnectionOptions = {
	host: process.env.REDIS_HOST || "127.0.0.1",
	port: parseInt(process.env.REDIS_PORT || "6379"),
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	maxRetriesPerRequest: null,
};
