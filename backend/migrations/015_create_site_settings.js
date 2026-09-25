exports.up = (knex) => knex.schema.createTable('site_settings', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.string('key', 100).notNullable().unique();
  t.text('value');
  t.timestamp('updated_at').defaultTo(knex.fn.now());
});
exports.down = (knex) => knex.schema.dropTable('site_settings');
