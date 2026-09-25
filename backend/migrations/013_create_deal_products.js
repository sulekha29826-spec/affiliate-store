exports.up = (knex) => knex.schema.createTable('deal_products', (t) => {
  t.uuid('deal_id').notNullable().references('id').inTable('deals').onDelete('CASCADE');
  t.uuid('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
  t.primary(['deal_id', 'product_id']);
});
exports.down = (knex) => knex.schema.dropTable('deal_products');
