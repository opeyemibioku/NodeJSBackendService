import express from "express";
import postController from "../controllers/postController.js";
import tryCatchHandler from "../utils/tryCatchHandler.js";

const postRouter = express.Router();

postRouter.post(
  "/create-post",
  tryCatchHandler(postController.createPostController)
);

export default postRouter;
