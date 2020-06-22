import Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("posts", (table) => {
    table.increments("id").primary().notNullable();
    table.string("message").notNullable();
    table.integer("user_id").notNullable();
    table
      .timestamp("date", { useTz: true })
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("posts");
}
