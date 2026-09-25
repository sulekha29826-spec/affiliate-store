exports.up = (knex) => knex.schema.createTable('admin_activity_logs', (t) => {
  t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  t.uuid('admin_id').references('id').inTable('users').onDelete('SET NULL');
  t.string('action', 100).notNullable();
  t.string('entity', 100);
  t.string('entity_id', 255);
  t.jsonb('metadata');
  t.timestamp('timestamp').defaultTo(knex.fn.now());
  t.index(['admin_id']);
  t.index(['timestamp']);
});
exports.down = (knex) => knex.schema.dropTable('admin_activity_logs');
