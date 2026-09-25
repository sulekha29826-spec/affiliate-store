const db = require('../config/db');
const { success, error } = require('../utils/response');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, merchant, min_price, max_price, min_discount, featured, trending, sort = 'newest', page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = db('products as p')
      .leftJoin('categories as c', 'p.category_id', 'c.id')
      .leftJoin('merchants as m', 'p.merchant_id', 'm.id')
      .select('p.id','p.title','p.slug','p.short_description','p.price','p.original_price','p.discount','p.currency','p.rating','p.review_count','p.featured','p.trending','p.status','p.created_at',
              'c.name as category_name','c.slug as category_slug',
              'm.name as merchant_name')
      .where('p.status', 'published');

    if (search) query.where((q) => q.whereILike('p.title', `%${search}%`).orWhereILike('p.brand', `%${search}%`));
    if (category) query.where('c.slug', category);
    if (merchant) query.where('p.merchant_id', merchant);
    if (min_price) query.where('p.price', '>=', parseFloat(min_price));
    if (max_price) query.where('p.price', '<=', parseFloat(max_price));
    if (min_discount) query.where('p.discount', '>=', parseFloat(min_discount));
    if (featured === 'true') query.where('p.featured', true);
    if (trending === 'true') query.where('p.trending', true);

    const sortMap = { newest: ['p.created_at', 'desc'], price_asc: ['p.price', 'asc'], price_desc: ['p.price', 'desc'], discount: ['p.discount', 'desc'], popular: ['p.review_count', 'desc'] };
    const [col, dir] = sortMap[sort] || sortMap.newest;
    query.orderBy(col, dir);

    const [{ count }] = await db('products').where('status', 'published').count('id as count');
    const products = await query.limit(parseInt(limit)).offset(offset);

    // Get first image for each product
    const productIds = products.map((p) => p.id);
    const images = productIds.length ? await db('product_images').whereIn('product_id', productIds).orderBy('sort_order').select('product_id','url') : [];
    const imageMap = {};
    images.forEach((img) => { if (!imageMap[img.product_id]) imageMap[img.product_id] = img.url; });
    const result = products.map((p) => ({ ...p, image: imageMap[p.id] || null }));

    return success(res, { products: result, pagination: { page: parseInt(page), limit: parseInt(limit), total: parseInt(count), pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await db('products as p')
      .leftJoin('categories as c', 'p.category_id', 'c.id')
      .leftJoin('merchants as m', 'p.merchant_id', 'm.id')
      .select('p.*','c.name as category_name','c.slug as category_slug','m.name as merchant_name','m.logo as merchant_logo','m.website as merchant_website')
      .where('p.slug', req.params.slug).where('p.status', 'published').first();

    if (!product) return error(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');

    const images = await db('product_images').where({ product_id: product.id }).orderBy('sort_order').select('url');
    const tags = await db('product_tags as t').join('product_tag_relations as r', 't.id', 'r.tag_id').where('r.product_id', product.id).select('t.name','t.slug');
    const related = await db('products').where({ category_id: product.category_id, status: 'published' }).whereNot({ id: product.id }).limit(6).select('id','title','slug','price','original_price','discount','rating');

    const { password_hash, affiliate_url, ...safeProduct } = product;
    return success(res, { product: { ...safeProduct, images: images.map((i) => i.url), tags, related } });
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { images, tags, ...productData } = req.body;
    const [product] = await db('products').insert(productData).returning('*');

    if (images?.length) await db('product_images').insert(images.map((url, i) => ({ product_id: product.id, url, sort_order: i })));
    if (tags?.length) {
      for (const tagName of tags) {
        const slug = tagName.toLowerCase().replace(/\s+/g, '-');
        let tag = await db('product_tags').where({ slug }).first();
        if (!tag) [tag] = await db('product_tags').insert({ name: tagName, slug }).returning('*');
        await db('product_tag_relations').insert({ product_id: product.id, tag_id: tag.id }).onConflict().ignore();
      }
    }
    return success(res, { product }, 201, 'Product created');
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { images, tags, ...productData } = req.body;
    const [product] = await db('products').where({ id: req.params.id }).update({ ...productData, updated_at: db.fn.now() }).returning('*');
    if (!product) return error(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return success(res, { product }, 200, 'Product updated');
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await db('products').where({ id: req.params.id }).delete();
    if (!deleted) return error(res, 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    return success(res, {}, 200, 'Product deleted');
  } catch (err) { next(err); }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const products = await db('products').where({ status: 'published', featured: true }).limit(12).select('id','title','slug','price','original_price','discount','currency','rating','review_count');
    return success(res, { products });
  } catch (err) { next(err); }
};

exports.getTrending = async (req, res, next) => {
  try {
    const products = await db('products').where({ status: 'published', trending: true }).limit(12).select('id','title','slug','price','original_price','discount','currency','rating','review_count');
    return success(res, { products });
  } catch (err) { next(err); }
};
