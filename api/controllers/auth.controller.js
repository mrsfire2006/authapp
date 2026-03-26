import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

const createToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.SECRETKEY, {
    expiresIn: "3m",
  });
  return token;
};

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
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
      maxAge:  1 * 60 * 60 *1000 ,
    });
    const { password: hashedpassword, ...rest } = findedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export { signup, signin };
