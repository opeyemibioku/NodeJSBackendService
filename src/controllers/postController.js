import { Post } from "../models/postModel.js";
import { User } from "../models/authModel.js";
import config from "../config/index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../utils/jwtUtils.js";
import { generateJWT } from "../utils/jwtUtils.js";
import {
  BadUserRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../error/error.js";

dotenv.config();

const postController = {
  createPostController: async (req, res) => {
    try {
      // Verify the token directly within the endpoint
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnAuthorizedError("Invalid token format");
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
};

export default postController;
