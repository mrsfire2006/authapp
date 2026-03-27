import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcrypt";
const updateUser = async (req, res, next) => {
  const id = req.user.id;
  if (id !== req.params.id) {
    return next(errorHandler(401, "You can only update your account"));
  }
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username: req.body.username || undefined,
          email: req.body.email || undefined,
          password: req.body.password || undefined,
          profilePicture: req.body.profilePicture || undefined,
        },
      },
      { returnDocument: "after", runValidators: true },
    );
    const { password: hashedPassword, ...rest } = user._doc;
    return res.status(200).json(rest);
  } catch (err) {
    return next(err);
  }
};

export { updateUser };
