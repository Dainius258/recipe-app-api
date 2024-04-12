/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("comments", (table) => {
    table.increments("id").primary();
    table.integer("recipe_id").references("id").inTable("recipes");
    table.integer("user_id").references("id").inTable("users");
    table.text("comment_text");
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("comments");
}
