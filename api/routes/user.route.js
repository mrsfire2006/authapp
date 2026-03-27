import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { updateUser } from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.route("/update/:id").patch(verifyToken, updateUser);

export default userRouter;
