/**
 * @author emmanuelolaojo
 * @since 2021-01-13
 */

const {M_USER, M_PASS} = process.env;
const {CERT, KEY} = process.env;

const dbString = "mongodb://localhost:27017";
const DB = process.env.DB || "ESWagers";

export const config = {
  DB,
  M_USER,
  M_PASS,
  CERT,
  KEY,
  PORT: process.env.PORT || 8230,
  JWT_SECRET: "secret-secret",
  DB_URL: `${dbString}/${DB}`,
  DB_OPTIONS: {useNewUrlParser: true},
  MONGO_ERR: "MongoError",
  DUP_ERR: 11000,
  AUTH_TOKEN: "x-auth-token",
  DEFAULT_ERR_MSG: "OOPS! Sumfin goofed!!",
  AUTH_ERR_MSG: "Authentication Failed!",
  MAX_PAYLOAD: "50mb"
};
