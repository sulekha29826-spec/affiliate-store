exports.up = (knex) => knex.schema.createTable('product_tags', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.string('name', 100).notNullable().unique();
  t.string('slug', 120).notNullable().unique();
});
exports.down = (knex) => knex.schema.dropTable('product_tags');
