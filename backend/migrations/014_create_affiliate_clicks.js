exports.up = (knex) => knex.schema.createTable('affiliate_clicks', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.uuid('product_id').references('id').inTable('products').onDelete('SET NULL');
  t.uuid('merchant_id').references('id').inTable('merchants').onDelete('SET NULL');
  t.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
  t.string('session_id', 255);
  t.string('referrer', 1000);
  t.string('device_type', 50);
  t.string('browser', 100);
  t.string('country', 100);
  t.timestamp('timestamp').defaultTo(knex.fn.now());
  t.index(['product_id']);
  t.index(['merchant_id']);
  t.index(['timestamp']);
});
exports.down = (knex) => knex.schema.dropTable('affiliate_clicks');
