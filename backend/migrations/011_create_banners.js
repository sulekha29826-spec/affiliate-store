exports.up = (knex) => knex.schema.createTable('banners', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.string('title', 200).notNullable();
  t.string('subtitle', 300);
  t.string('image', 1000);
  t.string('cta_text', 100);
  t.string('cta_url', 500);
  t.enum('status', ['active', 'inactive']).defaultTo('active');
  t.integer('sort_order').defaultTo(0);
  t.timestamp('start_date');
  t.timestamp('end_date');
  t.timestamps(true, true);
});
exports.down = (knex) => knex.schema.dropTable('banners');
