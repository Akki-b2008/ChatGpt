const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");

async function authMiddlewre(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized, missing token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userModel.findById({
      _id: decoded.id,
    });

    (req.user = user), next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = authMiddlewre;
