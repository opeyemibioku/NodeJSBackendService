import express from "express";
import authController from "../controllers/authController.js";
import tryCatchHandler from "../utils/tryCatchHandler.js";

const authRouter = express.Router();

authRouter.post("/signup", tryCatchHandler(authController.signUpController));
authRouter.post("/login", tryCatchHandler(authController.loginController));
authRouter.get(
  "/user-details",
  tryCatchHandler(authController.getUserDetailsController)
);
// authRouter.get("/get-user", tryCatchHandler(authController.getUserController));

export default authRouter;
