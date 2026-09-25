const success = (res, data = {}, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({ success: true, message, data });
};

const error = (res, message = 'Error', statusCode = 400, code = 'ERROR') => {
  return res.status(statusCode).json({ success: false, message, code });
};

module.exports = { success, error };
