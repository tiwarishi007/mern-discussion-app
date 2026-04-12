const User = require("../models/User.model");
const Problem = require("../models/discussion.model");
const bcrypt = require("bcryptjs");

exports.getUserProfile = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const userData = await User.findById(userId).select("-password");
    const problemData = await Problem.find({ user: userId })
      .populate("comments.user", "fullName")
      .sort({ createdAt: -1 });

    return res.json({
      ...userData.toObject(),
      problems: problemData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
