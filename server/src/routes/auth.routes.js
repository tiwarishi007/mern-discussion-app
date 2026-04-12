const express = require('express');
const {register, login, logoutUser} = require('../controllers/auth.controller');
const {protectRoutes} = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logoutUser);
router.get("/check", protectRoutes, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

module.exports = router;