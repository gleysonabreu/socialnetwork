import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("comment", (table) => {
    table.increments("id").notNullable(),
      table.string("message").notNullable(),
      table.integer("user_id").notNullable(),
      table.integer("post_id").notNullable(),
      table
        .timestamp("date", { useTz: true })
        .defaultTo(knex.raw("CURRENT_TIMESTAMP")),
      table.foreign("user_id").references("id").inTable("users"),
      table.foreign("post_id").references("id").inTable("posts");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("comment");
}
