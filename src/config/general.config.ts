export default {
  port: (process.env.PORT && parseInt(process.env.PORT)) ?? 4000,
  mongo: {
    uri: process.env.MONGO_URI ?? "",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "my-secret",
    timeLimit: process.env.JWT_TIME_LIMIT
      ? process.env.JWT_TIME_LIMIT + "s"
      : "86400s",
    timeLimitInMSec:
      1000 *
      (process.env.JWT_TIME_LIMIT
        ? parseInt(process.env.JWT_TIME_LIMIT)
        : 86400),
  },
  environment: process.env.NODE_ENV ?? "production",
};
