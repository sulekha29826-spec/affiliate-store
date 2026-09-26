exports.up = async function (knex) {
  // Check if categories already exist
  const catCount = await knex('categories').count('id as count').first();
  if (parseInt(catCount.count) > 0) return;

  // Insert Categories
  const categories = await knex('categories').insert([
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, audio & accessories', sort_order: 1, status: 'active' },
    { name: 'Fashion', slug: 'fashion', description: 'Clothing, footwear & lifestyle', sort_order: 2, status: 'active' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Appliances, decor & cookware', sort_order: 3, status: 'active' },
    { name: 'Beauty & Grooming', slug: 'beauty', description: 'Skincare, perfumes & personal care', sort_order: 4, status: 'active' },
    { name: 'Fitness & Sports', slug: 'fitness-sports', description: 'Workout gear, shoes & smartwatches', sort_order: 5, status: 'active' },
    { name: 'Books & Stationery', slug: 'books', description: 'Bestsellers, fiction & learning', sort_order: 6, status: 'active' },
  ]).returning('*');

  // Insert Merchants (no slug column in schema)
  const merchants = await knex('merchants').insert([
    { name: 'Amazon', website: 'https://amazon.in', status: 'active' },
    { name: 'Flipkart', website: 'https://flipkart.com', status: 'active' },
    { name: 'Myntra', website: 'https://myntra.com', status: 'active' },
  ]).returning('*');

  const catMap = {};
  categories.forEach((c) => { catMap[c.slug] = c.id; });
  const merMap = {};
  merchants.forEach((m) => { merMap[m.name] = m.id; });

  // Insert Sample Products
  const products = await knex('products').insert([
    {
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      slug: 'sony-wh-1000xm5-headphones',
      short_description: 'Industry-leading noise canceling with Auto NC Optimizer and 30-hour battery life.',
      description: 'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. With two processors controlling eight microphones, Auto NC Optimizer, and an ultra-comfortable lightweight design.',
      brand: 'Sony',
      category_id: catMap['electronics'],
      merchant_id: merMap['Amazon'],
      affiliate_url: 'https://amazon.in/dp/B09XS7JWHH?tag=affiliate-21',
      price: 26990,
      original_price: 34990,
      discount: 23,
      currency: 'INR',
      rating: 4.8,
      review_count: 1420,
      featured: true,
      trending: true,
      status: 'published'
    },
    {
      title: 'Apple MacBook Air M3 13-inch (16GB RAM, 512GB SSD)',
      slug: 'apple-macbook-air-m3-13',
      short_description: 'Lean. Mean. M3 machine with incredible 18-hour battery life and Liquid Retina display.',
      description: 'Supercharged by the next-generation M3 chip, the MacBook Air is strikingly thin and fast with support for up to two external displays and spatial audio.',
      brand: 'Apple',
      category_id: catMap['electronics'],
      merchant_id: merMap['Amazon'],
      affiliate_url: 'https://amazon.in/dp/B0CX23V25D?tag=affiliate-21',
      price: 114900,
      original_price: 134900,
      discount: 15,
      currency: 'INR',
      rating: 4.9,
      review_count: 856,
      featured: true,
      trending: true,
      status: 'published'
    },
    {
      title: 'Nike Air Zoom Pegasus 40 Running Shoes',
      slug: 'nike-air-zoom-pegasus-40',
      short_description: 'A springy ride for every run, familiar just for you to help you accomplish your goals.',
      description: 'The Pegasus 40 offers improved comfort in sensitive areas of your foot, like the arch and toes, while maintaining responsive Zoom Air cushioning.',
      brand: 'Nike',
      category_id: catMap['fitness-sports'],
      merchant_id: merMap['Myntra'],
      affiliate_url: 'https://myntra.com/shoes/nike?tag=affiliate-21',
      price: 7995,
      original_price: 11995,
      discount: 33,
      currency: 'INR',
      rating: 4.6,
      review_count: 530,
      featured: true,
      trending: false,
      status: 'published'
    },
    {
      title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker (6 Quart)',
      slug: 'instant-pot-duo-7-in-1',
      short_description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer & more.',
      description: 'Cook fast or slow with the Instant Pot Duo. 13 one-touch smart programs put cooking on autopilot with over 10 safety features.',
      brand: 'Instant Pot',
      category_id: catMap['home-kitchen'],
      merchant_id: merMap['Flipkart'],
      affiliate_url: 'https://flipkart.com/instant-pot?tag=affiliate-21',
      price: 6499,
      original_price: 9999,
      discount: 35,
      currency: 'INR',
      rating: 4.7,
      review_count: 3120,
      featured: false,
      trending: true,
      status: 'published'
    }
  ]).returning('*');

  // Insert product images
  const pMap = {};
  products.forEach((p) => { pMap[p.slug] = p.id; });

  await knex('product_images').insert([
    { product_id: pMap['sony-wh-1000xm5-headphones'], url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80', sort_order: 0 },
    { product_id: pMap['apple-macbook-air-m3-13'], url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', sort_order: 0 },
    { product_id: pMap['nike-air-zoom-pegasus-40'], url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', sort_order: 0 },
    { product_id: pMap['instant-pot-duo-7-in-1'], url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80', sort_order: 0 },
  ]);
};

exports.down = async function (knex) {
  await knex('product_images').delete();
  await knex('products').delete();
  await knex('categories').delete();
  await knex('merchants').delete();
};
