import { Post } from "../models/postModel.js";
import { User } from "../models/authModel.js";
import config from "../config/index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../utils/jwtUtils.js";
import { generateJWT } from "../utils/jwtUtils.js";
import { BadUserRequestError, NotFoundError } from "../error/error.js";

dotenv.config();

const postController = {
  createPostController: async (req, res) => {
    try {
      // Verify the token directly within the endpoint
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error();
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, config.jwt_secret_key);

      const userIdFromToken = decodedToken._id;
      const { title, content } = req.body;

      const user = await User.findById(userIdFromToken);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const newPost = await Post.create({
        title,
        content,
        author: user._id,
      });

      user.posts.push(newPost);
      await user.save();

      res.status(201).json({ post: newPost });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getPostsController: async (req, res) => {
    try {
      // Verify the token directly within the endpoint
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Invalid token format");
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, config.jwt_secret_key);

      const userIdFromToken = decodedToken._id;

      const { userId } = req.params;

      if (userId !== userIdFromToken) {
        throw new Error("Unauthorized");
      }

      const user = await User.findById(userId).populate("posts");

      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.json({ posts: user.posts });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  editPostController: async (req, res) => {
    try {
      // Verify the token directly within the endpoint
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Invalid token format");
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, config.jwt_secret_key);

      const userIdFromToken = decodedToken._id;

      const { postId } = req.params;
      const { title, content } = req.body;

      const post = await Post.findById(postId);

      if (!post) {
        throw new NotFoundError("Post not found");
      }

      // Ensure that the user editing the post is the post's author
      if (post.author.toString() !== userIdFromToken) {
        throw new UnauthorizedError("Unauthorized");
      }

      post.title = title;
      post.content = content;

      await post.save();

      res.json({ post });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default postController;
