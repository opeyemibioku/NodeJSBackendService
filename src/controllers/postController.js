import { Post } from "../models/postModel.js";
import { User } from "../models/authModel.js";
import { verifyJWT } from "../utils/jwtUtils.js";
import { BadUserRequestError, NotFoundError } from "../error/error.js";

const postController = {
  createPostController: async (req, res) => {
    try {
      // Verify the token
      const decodedToken = verifyJWT(req.headers.authorization);

      // Assuming your token includes the user ID
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
      // Verify the token
      const decodedToken = verifyJWT(req.headers.authorization);

      // Assuming your token includes the user ID
      const userIdFromToken = decodedToken.id;

      const { userId } = req.params;

      if (userId !== userIdFromToken) {
        throw new UnauthorizedError("Unauthorized");
      }

      const user = await User.findById(userIdFromToken).populate("posts");

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
      // Verify the token
      const decodedToken = verifyJWT(req.headers.authorization);

      // Assuming your token includes the user ID
      const userIdFromToken = decodedToken.id;

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
