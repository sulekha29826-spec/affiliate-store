const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/affiliateController');
const { authenticate } = require('../middleware/auth');

// Optional auth — works for both guests and logged-in users
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}
  }
  next();
};

router.post('/click', optionalAuth, ctrl.trackClick);

module.exports = router;
