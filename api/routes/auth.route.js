import express from "express";
import { signup, signin, google } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.route("/signup").post(signup);
authRouter.route("/signin").post(signin);
authRouter.route("/google").post(google);
export default authRouter;
