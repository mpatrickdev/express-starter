import User from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncErrors } from "../middleware/asyncError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendMail } from "../utils/sendMail.js";
import crypto from "crypto";

export const createUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
  });

  sendToken(user, 201, res);
});

// Login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter your email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invails email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invails email or password", 401));
  }

  sendToken(user, 200, res);
});

// logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logout success" });
});

// forgot password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // get reset token
  const resetToken = user.getResetToken();

  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n \n ${resetPasswordUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: "App Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    await user.save();
    return next(new ErrorHandler(error.message));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // create token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTime: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password url is invalid or expired", 400)
    );
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords did not match", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTime = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get profile details
export const userDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 401));
  }

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is invalid", 401));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Passwords did not match", 401));
  }

  user.password = newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Update profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, location } = req.body;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const newUserData = { firstName, lastName, location };
  // add cloudinary here
  const updates = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users -- Admin
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Get all users -- Admin
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// change user role
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const newUserData = { role };

  const updates = await User.findByIdAndUpdate(id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// change user role
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
