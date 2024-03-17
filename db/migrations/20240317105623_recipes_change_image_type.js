/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable("recipes", (table) => {
    table.text("image").notNullable().alter();
    table.text("guide").notNullable().alter();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable("recipes", (table) => {
    table.string("image").notNullable().alter();
    table.string("guide").notNullable().alter();
  });
}
