exports.up = (knex) => knex.schema.createTable('password_reset_tokens', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
  t.string('token_hash', 255).notNullable();
  t.timestamp('expires_at').notNullable();
  t.boolean('used').defaultTo(false);
  t.timestamp('created_at').defaultTo(knex.fn.now());
});
exports.down = (knex) => knex.schema.dropTable('password_reset_tokens');
