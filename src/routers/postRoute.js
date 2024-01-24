import express from "express";
import postController from "../controllers/postController.js";
import tryCatchHandler from "../utils/tryCatchHandler.js";

const postRouter = express.Router();

postRouter.post(
  "/create-post",
  tryCatchHandler(postController.createPostController)
);
postRouter.get(
  "/view-posts",
  tryCatchHandler(postController.getPostsController)
);
postRouter.patch(
  "/update-post",
  tryCatchHandler(postController.editPostController)
);

export default postRouter;
