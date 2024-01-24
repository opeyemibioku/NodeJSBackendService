import dotenv from "dotenv";

dotenv.config();

const development = {
  MONGODB_CONNECTION_URL: process.env.DEV_MONGODB_CONNECTION_URL,
  PORT: 5000,
  jwt_secret_key: process.env.DEV_JWT_SECRET,
};

export default development;
