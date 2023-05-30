import { registerAs } from "@nestjs/config";

export default registerAs("config", () => {
  return {
    mongo: {
      dbname: process.env.DATABASE_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DATABASE_PORT,
      hostname: process.env.HOST_NAME,
      connection: process.env.DB_CONNECTION,
      params: process.env?.PARAMS,
    },
    session: {
      accessToken: process.env.ACCESS_TOKEN,
      jwtAccessTokenSecret: process.env.JWT_ACCESS_SECRET,
      jwtAccessTokenExpiresTime: process.env.JWT_ACCESS_EXPIRES_TIME,
      jwtRefreshTokenSecret: process.env.JWT_REFRESH_SECRET,
      jwtRefreshTokenExpiresTime: process.env.JWT_REFRESH_EXPIRES_TIME,
    },
  };
});
