export default {
  port: (process.env.PORT && parseInt(process.env.PORT)) ?? 4000,
  mongo: {
    uri: process.env.MONGO_URI ?? "",
  },
  jwt: {
    secretAT:
      process.env.JWT_SECRET_ACCESS_TOKEN ?? "my-secret-for-access-token",
    secretRT:
      process.env.JWT_SECRET_REFRESH_TOKEN ?? "my-secret-for-refresh-token",
    timeLimitAT: process.env.JWT_TIME_LIMIT_ACCESS_TOKEN
      ? process.env.JWT_TIME_LIMIT_ACCESS_TOKEN + "s"
      : "86400s",
    timeLimitInMSecAT:
      1000 *
      (process.env.JWT_TIME_LIMIT_ACCESS_TOKEN
        ? parseInt(process.env.JWT_TIME_LIMIT_ACCESS_TOKEN)
        : 86400),
    timeLimitRT: process.env.JWT_TIME_LIMIT_REFRESH_TOKEN
      ? process.env.JWT_TIME_LIMIT_REFRESH_TOKEN + "s"
      : "86400s",
    timeLimitInMSecRT:
      1000 *
      (process.env.JWT_TIME_LIMIT_REFRESH_TOKEN
        ? parseInt(process.env.JWT_TIME_LIMIT_REFRESH_TOKEN)
        : 86400),
  },
  development: true,
};
