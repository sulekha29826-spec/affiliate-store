exports.up = (knex) => knex.schema.createTable('product_tag_relations', (t) => {
  t.uuid('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
  t.uuid('tag_id').notNullable().references('id').inTable('product_tags').onDelete('CASCADE');
  t.primary(['product_id', 'tag_id']);
});
exports.down = (knex) => knex.schema.dropTable('product_tag_relations');
