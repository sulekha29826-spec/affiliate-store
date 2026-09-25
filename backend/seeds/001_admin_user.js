const argon2 = require('argon2');

exports.seed = async (knex) => {
  await knex('users').where({ email: 'admin@affiliate-store.com' }).delete();
  const password_hash = await argon2.hash('Admin@1234', { type: argon2.argon2id });
  await knex('users').insert({
    name: 'Admin',
    email: 'admin@affiliate-store.com',
    password_hash,
    role: 'admin',
    status: 'active',
  });
  console.log('✅ Admin user seeded — admin@affiliate-store.com / Admin@1234');
};
