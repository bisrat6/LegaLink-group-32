const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const query = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user);
  const expireDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  );
  const cookieOptions = {
    expires: expireDate,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    message,
  });
};
exports.signup = catchAsync(async (req, res) => {
  const result = await query.createUser(req.body);
  createSendToken(result.user_id, 201, res, 'Account created successfully');
});

exports.loginAccount = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if user exists or password correct

  const user = await query.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return next(new AppError('Invalid email or password', 401));
  }
  // If we reach this point, authentication was successful
  // Generate JWT token
  createSendToken(user.user_id, 200, res, 'Login successful');
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // 2) Check current password
  const isValid = await bcrypt.compare(currentPassword, req.user.password_hash);
  if (!isValid)
    return next(new AppError('Your current password is wrong', 401));

  await query.updatePassword(req.user.user_id, newPassword);

  // 4) Issue new token (so user stays logged in)
  createSendToken(req.user.user_id, 200, res, 'Password updated successfully');
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(new AppError('you are not logged in! please log in.', 401));
  // token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if the user with this token exist
  const user = await query.getUserById(decoded.id);
  if (!user)
    return next(
      new AppError('The user belonging to this token does not exist.', 401),
    );

  // check if the user is changed password before the token is issued
  if (user.password_changed_at) {
    const changedTimestamp = parseInt(
      user.password_changed_at.getTime() / 1000,
      10,
    );
    if (decoded.iat < changedTimestamp) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401,
        ),
      );
    }
  }

  req.user = user;
  next();
});
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await query.getUserByEmail(email);
  if (!user) {
    return next(
      new AppError('There is no address with this email address', 404),
    );
  }
  //generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Save the reset token and its expiration time to the user's record
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await query.updateUser(user);

  const resetURL = `${req.protocol}://${req.get('host')}/api/user/resetPassword/${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message: `Forgot your password? Reset it here: ${resetURL}`,
    });
    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await query.updateUser(user);
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await query.getUserByToken(hashedToken);
  if (!user || user.password_reset_expires < Date.now()) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  await query.updatePassword(user.user_id, req.body.password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await query.updateUser(user);

  createSendToken(user.user_id, 200, res, 'Password resetted successfully');
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await query.deleteMe(req.user.user_id);
  res.status(204).json({
    status: 'success',
    message: 'account successfully deleted',
    data: null,
  });
});
