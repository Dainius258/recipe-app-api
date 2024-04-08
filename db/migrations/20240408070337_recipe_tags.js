/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("recipe_tags", (table) => {
    table.increments("id").primary();
    table.integer("tag_id").references("id").inTable("tag");
    table.integer("recipe_id").references("id").inTable("recipes");
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("recipe_tags");
}
