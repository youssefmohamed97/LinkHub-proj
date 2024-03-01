export async function up(knex) {
  return knex.schema.alterTable('execution_steps', (table) => {
    table.jsonb('data_in').alter();
    table.jsonb('data_out').alter();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('execution_steps', (table) => {
    table.text('data_in').alter();
    table.text('data_out').alter();
  });
}
