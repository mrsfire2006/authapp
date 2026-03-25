import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

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

export { signup };
