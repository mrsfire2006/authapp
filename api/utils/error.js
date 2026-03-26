export const errorHandler = (err) => {
  // const error  = new Error();
  // error.statusCode = statusCode;
  // error.message = message;
  // return error;
  const msg = { message: {} };
  if (err.code == 11000) {
    msg.message["invalid"] = "invalid username or email";
    return msg;
  }
  Object.values(err.errors).forEach((error) => {
    msg.message[error.path] = error.message;
  });
  return msg;
};
