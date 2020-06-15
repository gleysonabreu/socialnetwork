import Knex from "knex";

export async function up(knex: Knex){
  return knex.schema.createTable('followers', table => {
    table.integer('user_follower').notNullable(),
    table.integer('user_following').notNullable(),
    table.timestamp('date', { useTz: true }).defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    
    table.primary(['user_following', 'user_follower']),

    table.foreign('user_follower').references('id').inTable('users'),
    table.foreign('user_following').references('id').inTable('users')
  });
}

export async function down(knex: Knex){
  return knex.schema.dropTable('followers');
}