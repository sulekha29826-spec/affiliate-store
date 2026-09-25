const db = require('../config/db');
const { success, error } = require('../utils/response');

exports.trackClick = async (req, res, next) => {
  try {
    const { product_id, session_id } = req.body;
    if (!product_id) return error(res, 'product_id required', 400, 'MISSING_PRODUCT_ID');

    const product = await db('products').where({ id: product_id, status: 'published' }).select('id','affiliate_url','merchant_id').first();
    if (!product) return error(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    if (!product.affiliate_url) return error(res, 'No affiliate URL', 400, 'NO_AFFILIATE_URL');

    // Validate affiliate URL (must be http/https)
    try { const url = new URL(product.affiliate_url); if (!['http:','https:'].includes(url.protocol)) throw new Error(); } 
    catch { return error(res, 'Invalid affiliate URL', 400, 'INVALID_URL'); }

    const ua = req.headers['user-agent'] || '';
    const device_type = /mobile/i.test(ua) ? 'mobile' : /tablet/i.test(ua) ? 'tablet' : 'desktop';

    await db('affiliate_clicks').insert({
      product_id,
      merchant_id: product.merchant_id,
      user_id: req.user?.id || null,
      session_id: session_id || null,
      referrer: req.headers.referer || null,
      device_type,
      timestamp: db.fn.now(),
    });

    return success(res, { redirect_url: product.affiliate_url }, 200, 'Click tracked');
  } catch (err) { next(err); }
};
