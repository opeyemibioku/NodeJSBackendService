// controllers/postController.js

import { Post } from "../models/postModel.js";
import { User } from "../models/authModel.js";
import { BadUserRequestError, NotFoundError } from "../error/error.js";

const postController = {
  createPostController: async (req, res) => {
    try {
      const { title, content } = req.body;

      const user = await User.findById(req.user.id); // Assuming you store user information in the request after authentication

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
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getPostsController: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).populate("posts");

      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.json({ posts: user.posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  editPostController: async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;

      const post = await Post.findById(postId);

      if (!post) {
        throw new NotFoundError("Post not found");
      }

      post.title = title;
      post.content = content;

      await post.save();

      res.json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default postController;
