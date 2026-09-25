const db = require('../config/db');
const { success, error } = require('../utils/response');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await db('categories').where({ status: 'active' }).orderBy('sort_order').select('id','name','slug','description','image','sort_order');
    return success(res, { categories });
  } catch (err) { next(err); }
};

exports.getCategoryProducts = async (req, res, next) => {
  try {
    const category = await db('categories').where({ slug: req.params.slug }).first();
    if (!category) return error(res, 'Category not found', 404, 'CATEGORY_NOT_FOUND');
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const products = await db('products').where({ category_id: category.id, status: 'published' }).limit(parseInt(limit)).offset(offset).select('id','title','slug','price','original_price','discount','rating','review_count');
    const [{ count }] = await db('products').where({ category_id: category.id, status: 'published' }).count('id as count');
    return success(res, { category, products, pagination: { page: parseInt(page), limit: parseInt(limit), total: parseInt(count) } });
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const [cat] = await db('categories').insert(req.body).returning('*');
    return success(res, { category: cat }, 201, 'Category created');
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const [cat] = await db('categories').where({ id: req.params.id }).update({ ...req.body, updated_at: db.fn.now() }).returning('*');
    if (!cat) return error(res, 'Category not found', 404, 'CATEGORY_NOT_FOUND');
    return success(res, { category: cat });
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const deleted = await db('categories').where({ id: req.params.id }).delete();
    if (!deleted) return error(res, 'Category not found', 404, 'CATEGORY_NOT_FOUND');
    return success(res, {}, 200, 'Category deleted');
  } catch (err) { next(err); }
};
