import dotenv from "dotenv";

dotenv.config();

const development = {
  MONGODB_CONNECTION_URL: "mongodb://127.0.0.1/nodejsbackendservice",
  PORT: 5000,
  jwt_secret_key: process.env.DEV_JWT_SECRET,
};

export default development;
