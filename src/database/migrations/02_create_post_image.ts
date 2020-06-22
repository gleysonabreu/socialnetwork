import Knex from "knex";

<<<<<<< HEAD
export async function up(knex: Knex) {
  return knex.schema.createTable("post_image", (table) => {
    table.increments("id").notNullable(),
      table.string("url").notNullable(),
      table.integer("post_id").references("id").inTable("posts").notNullable();
  });
}

export async function down(knex: Knex) {
=======
export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("post_image", (table) => {
    table.increments("id").notNullable();
    table.string("url").notNullable();
    table.integer("post_id").references("id").inTable("posts").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
>>>>>>> gleysonabreu
  return knex.schema.dropTable("post_image");
}
