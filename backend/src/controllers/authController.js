const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const { success, error } = require('../utils/response');

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 422, 'VALIDATION_ERROR');

    const { name, email, password } = req.body;
    const existing = await db('users').where({ email }).first();
    if (existing) return error(res, 'Email already registered', 409, 'EMAIL_EXISTS');

    const password_hash = await argon2.hash(password, { type: argon2.argon2id });
    const [user] = await db('users').insert({ name, email, password_hash }).returning(['id','name','email','role','status','created_at']);

    const tokens = generateTokens(user);
    return success(res, { user, ...tokens }, 201, 'Registered successfully');
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 422, 'VALIDATION_ERROR');

    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) return error(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS');
    if (user.status === 'inactive') return error(res, 'Account deactivated', 403, 'ACCOUNT_INACTIVE');

    const valid = await argon2.verify(user.password_hash, password);
    if (!valid) return error(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS');

    const tokens = generateTokens(user);
    const { password_hash, ...userData } = user;
    return success(res, { user: userData, ...tokens }, 200, 'Login successful');
  } catch (err) { next(err); }
};

exports.logout = async (req, res) => {
  return success(res, {}, 200, 'Logged out successfully');
};

exports.me = async (req, res, next) => {
  try {
    const user = await db('users').where({ id: req.user.id }).select('id','name','email','role','status','created_at').first();
    if (!user) return error(res, 'User not found', 404, 'USER_NOT_FOUND');
    return success(res, { user });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await db('users').where({ email }).first();
    // Always return success to prevent email enumeration
    if (!user) return success(res, {}, 200, 'If that email exists, a reset link has been sent');

    const token = uuidv4();
    const token_hash = await argon2.hash(token, { type: argon2.argon2id });
    const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db('password_reset_tokens').insert({ user_id: user.id, token_hash, expires_at });
    // TODO: Send email with token
    console.log('Password reset token (dev):', token);
    return success(res, {}, 200, 'If that email exists, a reset link has been sent');
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 422, 'VALIDATION_ERROR');

    const { token, email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) return error(res, 'Invalid or expired token', 400, 'INVALID_TOKEN');

    const resetRecord = await db('password_reset_tokens')
      .where({ user_id: user.id, used: false })
      .where('expires_at', '>', new Date())
      .orderBy('created_at', 'desc')
      .first();

    if (!resetRecord) return error(res, 'Invalid or expired token', 400, 'INVALID_TOKEN');

    const valid = await argon2.verify(resetRecord.token_hash, token);
    if (!valid) return error(res, 'Invalid or expired token', 400, 'INVALID_TOKEN');

    const password_hash = await argon2.hash(password, { type: argon2.argon2id });
    await db('users').where({ id: user.id }).update({ password_hash });
    await db('password_reset_tokens').where({ id: resetRecord.id }).update({ used: true });

    return success(res, {}, 200, 'Password reset successful');
  } catch (err) { next(err); }
};
