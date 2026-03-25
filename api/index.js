import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
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
