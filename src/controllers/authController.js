import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/authModel.js";
import { BadUserRequestError } from "../error/error.js";
import { userValidator, loginValidator } from "../validators/authValidator.js";
import { generateJWT } from "../utils/jwtUtils.js";
// import config from "../config/index.js";
import dotenv from "dotenv";
// import { generateEmailConfirmToken } from "../config/mailer.js";

// dotenv.config({ path: "./configenv.env" });
dotenv.config();

const authController = {
  signUpController: async (req, res) => {
    const { error } = userValidator.validate(req.body);
    if (error) throw error;
    const { firstName, lastName, email, password } = req.body;
    const emailExists = await User.find({ email });
    if (emailExists.length > 0)
      throw new BadUserRequestError(
        "An account with this email already exists"
      );
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    await newUser.save().then((user) => {
      //   const tokenPayload = { email: newUser.email };
      // const verificationToken = generateToken(tokenPayload);
      //   const verificationToken = generateEmailConfirmToken(tokenPayload);

      const token = generateJWT(user); // Generate JWT using the helper function

      res.json({
        user: {
          id: user._id,
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
          token: token,
        },
      });
      console.log(user);
    });
  },
  loginController: async (req, res) => {
    const { error } = loginValidator.validate(req.body);
    if (error) throw error;
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
      // email: req.body?.email,
    });
    if (!user) throw new BadUserRequestError("Incorrect email or password");

    const hash = bcrypt.compareSync(req.body.password, user.password);
    // const hash = bcrypt.compareSync(req.body.password, user.password);
    if (!hash) throw new BadUserRequestError("incorrect email or password");

    const token = generateJWT(user);

    res.json({
      user: {
        id: user._id,
        firstname: user.firstName,
        email: user.email,
        token: token,
      },
    });
  },

  getUserDetailsController: async (req, res) => {
    try {
      // Extract filtering parameters from the request
      const { firstName, lastName, dateAdded } = req.query;

      // Construct query with filtering options
      let filter = {};

      if (firstName) {
        filter.firstName = firstName;
      }
      if (lastName) {
        filter.lastName = lastName;
      }
      if (dateAdded) {
        filter.dateAdded = dateAdded;
      }

      // Fetch users based on the query
      const users = await User.find(filter);

      // Send the response with the retrieved users
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users" });
    }
  },
  
};

export default authController;
