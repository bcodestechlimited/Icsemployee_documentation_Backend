const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const crypto = require("crypto");
const OTP = require("../models/OTP");
const transporter = require("../lib/transporter");

const registerUser = async (req, res, next) => {
  const { username, email, phone, password } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      data: errors.array(),
    });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate)
    return res.status(409).json({ message: "Email Already Exists" }); //Conflict

  const duplicateNumber = await User.findOne({ phone }).exec();
  if (duplicateNumber)
    return res.status(409).json({ message: "Phone Number Already Exists" }); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    const token = generateRandomNumber();
    //create and store the new user
    const result = await User.create({
      username,
      email,
      phone,
      password: hashedPwd,
      token,
    });

    // send email verification token
    let verifyMail = await sendMail(
      email,
      token,
      "email_template",
      "Verify Token",
    );

    res.status(201).json({ success: `A token has been sent to your mail` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendMail = async (email, token, template, subject) => {
  const mailOptions = {
    from: `"ICS Outsourcing" <${process.env.SENDER}>`,
    to: email,
    subject: subject,
    template: template,
    context: {
      token: token,
      year: new Date().getFullYear(),
    },
  };

  try {
    const data = await transporter.sendMail(mailOptions);
    return data;
  } catch (err) {
    // console.log(err);
    throw err;
    return err;
  }
};

const resendToken = async (req, res) => {
  try {
    const { email } = req.params;
    const token = generateRandomNumber();
    //create and store the new user
    const result = await User.findOne({ email }).exec();
    if (!result) res.status(500).json({ message: err.message });
    result.token = token;
    await result.save();
    // send email verification token
    let verifyMail = await sendMail(
      email,
      token,
      "email_template",
      "Verify Token",
    );
    res.status(201).json({ success: `A token has been sent to your mail` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  const user = await User.findOne({ token }).exec();
  if (!user) return res.status(401).json({ message: "Invalid Token" });
  user.emailVerified = true;
  user.token = "";
  user.save();
  res.status(201).json({ success: `Email Verification Success` });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) return res.status(404).json({ message: "Email does not exist" });
  const token = jwt.sign(
    {
      id: email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" },
  );
  const link = `${process.env.BASE_URL}ChangePassword/${token}`;
  try {
    const verifyEmail = await sendMail(
      email,
      link,
      "change_password",
      "Reset Password",
    );
    res.status(201).json({ success: `A link has been sent to your mail` });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` });
  }
};

const verifyPasswordReset = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let email = decoded.id;
    const foundUser = await User.findOne({ email: email });
    if (!foundUser)
      return res.status(403).json({ message: "Id does not exist" });
    return res
      .status(201)
      .json({ message: "Verification Successful", data: email });
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token", err });
  }
};

const confirmPasswordReset = async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      data: errors.array(),
    });

  const { email, password } = req.body;
  if (!email || !password)
    res.status(409).json({ message: "All details must be provided" });
  try {
    const foundUser = await User.findOne({ email }).exec();
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    foundUser.password = hashedPwd;
    await foundUser.save();
    res.status(201).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(403).json({ message: error });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      data: errors.array(),
    });
  const foundUser = await User.findOne({ email: email.toLowerCase() }).exec();

  console.log({ foundUser });

  if (!foundUser) return res.status(404).json({ message: "User not found" });
  // evaluate password
  if (!foundUser?.emailVerified)
    return res.status(402).json({ message: "Email is not verified" });
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // create JWTs
    const returnUser = await User.findOne({ email }, "-password").exec();
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          isAdmin: foundUser.isAdmin,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    res.status(201).json({
      message: `User logged in!`,
      data: returnUser,
      token: accessToken,
    });
  } else {
    res.status(401).json({ message: "Incorrect Password" });
  }
};

const generateRandomNumber = () => {
  return [...Array(4)]
    .map(() => "0123456789"[Math.floor(Math.random() * "0123456789".length)])
    .join("");
};

// version 2

const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  await OTP.findOneAndDelete({ email });
  let meme = await OTP.create({ email, otp });
  const subject = "Here is your OTP";
  const text = `Please use this otp to reset your password. OTP: ${otp}`;
  const info = await sendEmail({ to: email, subject, text });

  res.status(201).json({
    success: true,
    message: `OTP has been sent to ${info.envelope.to}`,
  });
};

const ChangePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is valid
    const validOTP = await OTP.findOne({ email, otp });
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP after successful reset
    await OTP.deleteOne({ email });

    return res.json({ message: "Password reset successful", user });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 2525,
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "admin@icsoutsourcing.com",
    to,
    subject,
    text,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  ChangePassword,
  registerUser,
  verifyEmail,
  login,
  resendToken,
  sendMail,
  resetPassword,
  verifyPasswordReset,
  confirmPasswordReset,
  sendOTP,
};
