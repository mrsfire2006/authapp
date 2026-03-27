import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { errorHandler } from "../utils/error.js";

const createToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.SECRETKEY, {
    expiresIn: "3m",
  });
  return token;
};
const google = async (req, res, next) => {
  const { name, email, profilePicture } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = createToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 60 * 1000,
      });
      const { password: hashedpassword, ...rest } = user._doc;
      return res.json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email: email,
        password: generatedPassword,
        profilePicture: profilePicture,
      });
      await newUser.save();

      const token = createToken(newUser._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 60 * 1000,
      });
      const { password: hashedpassword, ...rest } = newUser._doc;
      return res.json(rest);
    }
  } catch (err) {
    next(errorHandler(err));
  }
};
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    const { password: hashedpassword, ...rest } = newUser._doc;
    const token = createToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 60 * 1000,
    });
    return res.status(201).json(rest);
  } catch (error) {
    next(errorHandler(error));
  }
};
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const findedUser = await User.findOne({ email: email });
    if (!findedUser) {
      next({ code: 400, message: "email or password is wrong" });
    }
    const valid = await bcrypt.compare(password, findedUser.password);
    if (!valid) {
      return next({ code: 400, message: "email or password is wrong" });
    }
    const token = createToken(findedUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 60 * 1000,
    });
    const { password: hashedpassword, ...rest } = findedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(error));
  }
};

export { signup, signin, google };
