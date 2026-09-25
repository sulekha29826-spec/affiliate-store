const db = require('../config/db');
const { success } = require('../utils/response');

exports.getDashboard = async (req, res, next) => {
  try {
    const [[totalProducts], [activeProducts], [totalUsers], [totalClicks], [featuredCount], [activeDeals]] = await Promise.all([
      db('products').count('id as count'),
      db('products').where({ status: 'published' }).count('id as count'),
      db('users').where({ role: 'user' }).count('id as count'),
      db('affiliate_clicks').count('id as count'),
      db('products').where({ featured: true, status: 'published' }).count('id as count'),
      db('deals').where({ status: 'active' }).count('id as count'),
    ]);

    return success(res, {
      stats: {
        total_products: parseInt(totalProducts.count),
        active_products: parseInt(activeProducts.count),
        total_users: parseInt(totalUsers.count),
        affiliate_clicks: parseInt(totalClicks.count),
        featured_products: parseInt(featuredCount.count),
        active_deals: parseInt(activeDeals.count),
      }
    });
  } catch (err) { next(err); }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    const days = period === '30d' ? 30 : period === 'today' ? 1 : 7;
    const since = new Date(Date.now() - days * 86400000);

    const clicksByDay = await db('affiliate_clicks')
      .where('timestamp', '>=', since)
      .select(db.raw("DATE(timestamp) as date"), db.raw('COUNT(*) as clicks'))
      .groupByRaw('DATE(timestamp)')
      .orderBy('date');

    const topProducts = await db('affiliate_clicks as ac')
      .join('products as p', 'ac.product_id', 'p.id')
      .where('ac.timestamp', '>=', since)
      .select('p.id','p.title','p.slug', db.raw('COUNT(ac.id) as clicks'))
      .groupBy('p.id','p.title','p.slug')
      .orderByRaw('COUNT(ac.id) DESC')
      .limit(10);

    return success(res, { clicks_by_day: clicksByDay, top_products: topProducts, period });
  } catch (err) { next(err); }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const users = await db('users').select('id','name','email','role','status','created_at').limit(parseInt(limit)).offset(offset).orderBy('created_at','desc');
    const [{ count }] = await db('users').count('id as count');
    return success(res, { users, pagination: { page: parseInt(page), limit: parseInt(limit), total: parseInt(count) } });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { status, role } = req.body;
    const [user] = await db('users').where({ id: req.params.id }).update({ status, role }).returning(['id','name','email','role','status']);
    return success(res, { user });
  } catch (err) { next(err); }
};

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await db('banners').orderBy('sort_order').select();
    return success(res, { banners });
  } catch (err) { next(err); }
};
exports.createBanner = async (req, res, next) => {
  try {
    const [banner] = await db('banners').insert(req.body).returning('*');
    return success(res, { banner }, 201);
  } catch (err) { next(err); }
};
exports.updateBanner = async (req, res, next) => {
  try {
    const [banner] = await db('banners').where({ id: req.params.id }).update({ ...req.body, updated_at: db.fn.now() }).returning('*');
    return success(res, { banner });
  } catch (err) { next(err); }
};
exports.deleteBanner = async (req, res, next) => {
  try {
    await db('banners').where({ id: req.params.id }).delete();
    return success(res, {}, 200, 'Banner deleted');
  } catch (err) { next(err); }
};

exports.getDeals = async (req, res, next) => {
  try {
    const deals = await db('deals').orderBy('created_at','desc').select();
    return success(res, { deals });
  } catch (err) { next(err); }
};
exports.createDeal = async (req, res, next) => {
  try {
    const [deal] = await db('deals').insert(req.body).returning('*');
    return success(res, { deal }, 201);
  } catch (err) { next(err); }
};
exports.updateDeal = async (req, res, next) => {
  try {
    const [deal] = await db('deals').where({ id: req.params.id }).update({ ...req.body, updated_at: db.fn.now() }).returning('*');
    return success(res, { deal });
  } catch (err) { next(err); }
};
exports.deleteDeal = async (req, res, next) => {
  try {
    await db('deals').where({ id: req.params.id }).delete();
    return success(res, {}, 200, 'Deal deleted');
  } catch (err) { next(err); }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await db('site_settings').select('key','value');
    const map = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return success(res, { settings: map });
  } catch (err) { next(err); }
};
exports.updateSettings = async (req, res, next) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await db('site_settings').insert({ key, value }).onConflict('key').merge({ value, updated_at: db.fn.now() });
    }
    return success(res, {}, 200, 'Settings updated');
  } catch (err) { next(err); }
};
