import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a valid password"],
    minlength: [8, "Minimum password length must be 8 characters"],
  },
  //   isEmailVerified: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   otp: Number,
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

export { User };
