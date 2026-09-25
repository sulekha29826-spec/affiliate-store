const db = require('../config/db');
const { success, error } = require('../utils/response');

exports.getMerchants = async (req, res, next) => {
  try {
    const merchants = await db('merchants').where({ status: 'active' }).select('id','name','logo','website','description');
    return success(res, { merchants });
  } catch (err) { next(err); }
};

exports.createMerchant = async (req, res, next) => {
  try {
    const [merchant] = await db('merchants').insert(req.body).returning('*');
    return success(res, { merchant }, 201, 'Merchant created');
  } catch (err) { next(err); }
};

exports.updateMerchant = async (req, res, next) => {
  try {
    const [merchant] = await db('merchants').where({ id: req.params.id }).update({ ...req.body, updated_at: db.fn.now() }).returning('*');
    if (!merchant) return error(res, 'Merchant not found', 404, 'MERCHANT_NOT_FOUND');
    return success(res, { merchant });
  } catch (err) { next(err); }
};

exports.deleteMerchant = async (req, res, next) => {
  try {
    const deleted = await db('merchants').where({ id: req.params.id }).delete();
    if (!deleted) return error(res, 'Merchant not found', 404, 'MERCHANT_NOT_FOUND');
    return success(res, {}, 200, 'Merchant deleted');
  } catch (err) { next(err); }
};
