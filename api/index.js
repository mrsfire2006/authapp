import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

mongoose
  .connect(process.env.URLDB)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
  app.use(express.json());
  app.use(cookieParser()); 
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   }),
// );
app.use("/api/auth", authRouter);
app.use("/api/user", userRoutes);
app.use((err, req, res, next) => {
  const code = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(code).json({
    success: false,
    message,
    code,
  });
});
