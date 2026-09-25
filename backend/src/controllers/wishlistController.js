const db = require('../config/db');
const { success, error } = require('../utils/response');

const getOrCreateWishlist = async (userId) => {
  let wishlist = await db('wishlists').where({ user_id: userId }).first();
  if (!wishlist) [wishlist] = await db('wishlists').insert({ user_id: userId }).returning('*');
  return wishlist;
};

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user.id);
    const items = await db('wishlist_items as wi')
      .join('products as p', 'wi.product_id', 'p.id')
      .where('wi.wishlist_id', wishlist.id)
      .where('p.status', 'published')
      .select('p.id','p.title','p.slug','p.price','p.original_price','p.discount','p.rating','wi.added_at');
    return success(res, { items });
  } catch (err) { next(err); }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const product = await db('products').where({ id: req.params.productId, status: 'published' }).first();
    if (!product) return error(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    const wishlist = await getOrCreateWishlist(req.user.id);
    await db('wishlist_items').insert({ wishlist_id: wishlist.id, product_id: req.params.productId }).onConflict(['wishlist_id','product_id']).ignore();
    return success(res, {}, 200, 'Added to wishlist');
  } catch (err) { next(err); }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await db('wishlists').where({ user_id: req.user.id }).first();
    if (wishlist) await db('wishlist_items').where({ wishlist_id: wishlist.id, product_id: req.params.productId }).delete();
    return success(res, {}, 200, 'Removed from wishlist');
  } catch (err) { next(err); }
};
