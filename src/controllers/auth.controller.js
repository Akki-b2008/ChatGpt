const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");

async function registerController(req, res) {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const isUserExists = await userModel.findOne({
    email,
  });

  if (isUserExists) {
    return res.status(409).json({
      message: "User already exists.",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully.",
    user: {
      id: user._id,
      fullName: {
        firstName,
        lastName,
      },
      email,
    },
  });
}

async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isVaildPassword = await bcrypt.compare(password, user.password);

  if (!isVaildPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token);

  res.status(200).json({
    message : "User logged in successfully.",
    user: {
      id: user._id,
      email: email,
      fullName: user.fullName,
    },
  });
}

module.exports = {
  registerController,
  loginController,
};
