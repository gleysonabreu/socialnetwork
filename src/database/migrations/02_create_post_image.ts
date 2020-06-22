import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("post_image", (table) => {
    table.increments("id").notNullable(),
      table.string("url").notNullable(),
      table.integer("post_id").references("id").inTable("posts").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("post_image");
}
