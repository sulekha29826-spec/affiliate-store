const argon2 = require('argon2');

exports.up = async function (knex) {
  const adminEmail = 'admin@affiliate-store.com';
  const existing = await knex('users').where({ email: adminEmail }).first();
  const password_hash = await argon2.hash('Admin@1234', { type: argon2.argon2id });

  if (existing) {
    await knex('users').where({ email: adminEmail }).update({
      role: 'admin',
      status: 'active',
      password_hash,
      name: 'Admin',
    });
  } else {
    await knex('users').insert({
      name: 'Admin',
      email: adminEmail,
      password_hash,
      role: 'admin',
      status: 'active',
    });
  }
};

exports.down = async function (knex) {
  await knex('users').where({ email: 'admin@affiliate-store.com' }).delete();
};
