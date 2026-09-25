exports.up = (knex) => knex.schema.createTable('deals', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.string('title', 200).notNullable();
  t.text('description');
  t.string('image', 1000);
  t.string('cta', 500);
  t.timestamp('start_date');
  t.timestamp('end_date');
  t.enum('status', ['active', 'inactive', 'scheduled']).defaultTo('active');
  t.timestamps(true, true);
});
exports.down = (knex) => knex.schema.dropTable('deals');
