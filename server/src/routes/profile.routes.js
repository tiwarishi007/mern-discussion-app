const express = require("express");
const router = express.Router();
const { getUserProfile, updatePassword } = require("../controllers/profile.controller");
const { protectRoutes } = require("../middleware/auth.middleware");

router.get("/profile", protectRoutes, getUserProfile);
router.put("/profile/update-password", protectRoutes, updatePassword);

module.exports = router;
