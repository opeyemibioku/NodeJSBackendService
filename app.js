import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import globalErrorHandler from "./src/utils/errorHandler.js";
import authRouter from "./src/routers/authRoute.js";
import postRouter from "./src/routers/postRoute.js";
import config from "./src/config/index.js";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = config.MONGODB_CONNECTION_URL;

mongoose
  .connect(mongoURI)
  .then(console.log("Database connection is established"))
  .catch((err) => console.log(err.message));
const port = config.PORT;
const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

// Routes
app.use("/", authRouter);
app.use("/", postRouter);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// error handler
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
