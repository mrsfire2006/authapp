import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
  console.log(req);
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json("you need to login");
  }

  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return next(errorHandler(403, "token is not valid"));
    }
    req.user = user;
    next();
  });
};
