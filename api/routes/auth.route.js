import express from "express";
import { signup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.route("/signup").post(signup);
export default authRouter;
