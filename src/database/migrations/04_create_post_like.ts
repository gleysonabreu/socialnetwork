import Knex from "knex";
export async function up(knex: Knex){
  return knex.schema.createTable('post_like', table => {
    table.integer('user_id').notNullable(),
    table.integer('post_id').notNullable(),
    table.timestamp('date', { useTz: true }).defaultTo(knex.raw('CURRENT_TIMESTAMP')),

    table.primary(['user_id', 'post_id']),

    table.foreign('user_id').references('id').inTable('users'),
    table.foreign('post_id').references('id').inTable('posts')
  });
}

export async function down(knex: Knex){
  return knex.schema.dropTable('post_like');
}