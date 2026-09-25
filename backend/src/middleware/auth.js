const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'No token provided', 401, 'UNAUTHORIZED');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return error(res, 'Admin access required', 403, 'FORBIDDEN');
  }
  next();
};

module.exports = { authenticate, adminOnly };
