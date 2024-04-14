/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.table("recipes", function (table) {
    table.integer("likes").defaultTo(0);
    table.integer("dislikes").defaultTo(0);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.table("recipes", function (table) {
    table.dropColumn("likes");
    table.dropColumn("dislikes");
  });
}
