import Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("comment_like", (table) => {
    table.integer("user_id").notNullable();
    table.integer("comment_id").notNullable();
    table
      .timestamp("date", { useTz: true })
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.primary(["user_id", "comment_id"]);
    table.foreign("user_id").references("id").inTable("users");
    table.foreign("comment_id").references("id").inTable("comment");
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("comment_like");
}
