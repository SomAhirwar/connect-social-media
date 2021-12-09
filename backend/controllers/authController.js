const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const userController = require("./userController");

const signTokenAndSendResponse = async (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  let cookieOptions = {
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // const userObj = user.toObject();
  // delete userObj.password;
  // delete userObj.createdAt;
  // delete userObj.__v;

  const userPopulated = await userController.getPopulatedUser(user._id);

  res
    .status(statusCode)
    .cookie("jwt", token, cookieOptions)
    .json({
      status: "success",
      data: {
        token,
        user: userPopulated,
      },
    });
};

exports.signup = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      profileImg: req.file ? req.file.path : undefined,
      createdAt: Date.now(),
      passwordChangedAt: Date.now(),
    });

    signTokenAndSendResponse(user, 200, res);
  } catch (err) {
    res.status(403).json({
      satus: "failed",
      data: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    //Checking if username and password are present
    const { username, password } = req.body;
    if (!username || !password) throw new Error("Enter username and password");

    //Getting user
    const user = await User.findOne({ username }).select("+password");

    if (!user || !(await user.isPasswordCorrect(password, user.password)))
      throw new Error("Email or password is incorrect");

    signTokenAndSendResponse(user, 200, res);
  } catch (err) {
    res.status(403).json({
      status: "failed",
      error: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    //Get the token
    const token = req.cookies.jwt;
    if (!token) throw new Error("Login again to continue");

    //verify the token
    const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(payload.id);

    // cosole.log(currentUser);
    if (!currentUser)
      throw new Error("User not belong to token not found, Login again");

    //jwt is issued after password was changed
    if (currentUser.changedPasswordAfter(token.iat))
      throw new Error(
        "User has changed password. Please Login again to continue"
      );

    req.user = currentUser;
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
  next();
};

exports.logout = (req, res, next) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });

  res.redirect("/");
};
