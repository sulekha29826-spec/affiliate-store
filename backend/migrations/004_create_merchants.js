exports.up = (knex) => knex.schema.createTable('merchants', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.string('name', 100).notNullable();
  t.string('logo', 500);
  t.string('website', 500);
  t.text('description');
  t.enum('status', ['active', 'inactive']).defaultTo('active');
  t.timestamps(true, true);
});
exports.down = (knex) => knex.schema.dropTable('merchants');
