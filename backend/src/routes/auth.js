const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many attempts' } });

router.post('/register',
  [body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 chars'),
   body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
   body('password').isLength({ min: 8 }).withMessage('Password min 8 chars')],
  ctrl.register
);

router.post('/login', authLimiter,
  [body('email').isEmail().normalizeEmail(),
   body('password').notEmpty().withMessage('Password required')],
  ctrl.login
);

router.post('/logout', authenticate, ctrl.logout);
router.get('/me', authenticate, ctrl.me);

router.post('/forgot-password', authLimiter,
  [body('email').isEmail().normalizeEmail()],
  ctrl.forgotPassword
);

router.post('/reset-password', authLimiter,
  [body('token').notEmpty(),
   body('email').isEmail().normalizeEmail(),
   body('password').isLength({ min: 8 }).withMessage('Password min 8 chars')],
  ctrl.resetPassword
);

module.exports = router;
