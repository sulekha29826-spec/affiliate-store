exports.up = (knex) => knex.schema.createTable('users', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.string('name', 100).notNullable();
  t.string('email', 255).notNullable().unique();
  t.string('password_hash', 255).notNullable();
  t.enum('role', ['user', 'admin']).defaultTo('user');
  t.enum('status', ['active', 'inactive']).defaultTo('active');
  t.timestamps(true, true);
});
exports.down = (knex) => knex.schema.dropTable('users');
