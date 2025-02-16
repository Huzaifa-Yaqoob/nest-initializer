export default {
  port: (process.env.PORT && parseInt(process.env.PORT)) ?? 4000,
  mongo: {
    uri: process.env.MONGO_URI ?? "",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "my-secret",
  },
};
