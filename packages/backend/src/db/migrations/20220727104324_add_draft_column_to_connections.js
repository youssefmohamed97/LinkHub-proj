export async function up(knex) {
  return knex.schema.table('connections', (table) => {
    table.boolean('draft').defaultTo(true);
  });
}

export async function down(knex) {
  return knex.schema.table('connections', (table) => {
    table.dropColumn('draft');
  });
}
