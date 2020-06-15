import Knex from 'knex';
export async function up(knex: Knex){
  return knex.schema.createTable('users', table => {
    table.increments('id').primary().notNullable(),
    table.string('firstname').notNullable(),
    table.string('lastname').notNullable(),
    table.string('username').notNullable(),
    table.string('email').notNullable(),
    table.string('password').notNullable(),
    table.string('photo').notNullable(),
    table.date('date_birth').notNullable(),
    table.timestamp('signup_date', { useTz: true }).defaultTo(knex.raw('CURRENT_TIMESTAMP'))
  });
}

export async function down(knex: Knex){
  return knex.schema.dropTable('users');
}