exports.up = (knex) => knex.schema.createTable('product_images', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.uuid('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
  t.string('url', 1000).notNullable();
  t.integer('sort_order').defaultTo(0);
  t.timestamp('created_at').defaultTo(knex.fn.now());
});
exports.down = (knex) => knex.schema.dropTable('product_images');
