const production = {
  MONGODB_CONNECTION_URL: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
  PORT: 5000,
  jwt_secret_key: process.env.PRODUCTION_JWT_SECRET,
};

export default production;
