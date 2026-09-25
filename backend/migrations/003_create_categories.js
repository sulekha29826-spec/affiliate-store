exports.up = (knex) => knex.schema.createTable('categories', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.string('name', 100).notNullable();
  t.string('slug', 150).notNullable().unique();
  t.text('description');
  t.string('image', 500);
  t.enum('status', ['active', 'inactive']).defaultTo('active');
  t.integer('sort_order').defaultTo(0);
  t.timestamps(true, true);
});
exports.down = (knex) => knex.schema.dropTable('categories');
