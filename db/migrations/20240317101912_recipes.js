/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("recipes", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");
    table.string("title").notNullable();
    table.text("image").notNullable();
    table.specificType("ingredients", "text[]");
    table.text("guide").notNullable();
    table.integer("total_time_minutes").notNullable();
    table.integer("servings").notNullable();
    table.float("rating");
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("recipes");
}
