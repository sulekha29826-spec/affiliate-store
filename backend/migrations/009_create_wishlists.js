exports.up = (knex) => knex.schema.createTable('wishlists', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.uuid('user_id').notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
  t.timestamp('created_at').defaultTo(knex.fn.now());
});
exports.down = (knex) => knex.schema.dropTable('wishlists');
