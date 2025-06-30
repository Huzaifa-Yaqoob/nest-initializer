export default () => ({
  port: process.env.PORT,

  environment: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessJwtExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '3h',
  refreshJwtExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '1w',

  accessCookieExpiresIn:
    Number(process.env.ACCESS_COOKIE_EXPIRES_IN) || 10800000,
  refreshCookieExpiresIn:
    Number(process.env.REFRESH_COOKIE_EXPIRES_IN) || 604800000,
});
