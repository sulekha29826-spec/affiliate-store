exports.up = (knex) => knex.schema.createTable('wishlist_items', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.uuid('wishlist_id').notNullable().references('id').inTable('wishlists').onDelete('CASCADE');
  t.uuid('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
  t.timestamp('added_at').defaultTo(knex.fn.now());
  t.unique(['wishlist_id', 'product_id']);
});
exports.down = (knex) => knex.schema.dropTable('wishlist_items');
