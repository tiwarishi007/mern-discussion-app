const jwt = require("jsonwebtoken");
const { key } = require("../config/env");
const User = require("../models/User.model");

exports.protectRoutes = async (req, res, next) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Found" });
    }

    const decoded = jwt.verify(token, key);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};