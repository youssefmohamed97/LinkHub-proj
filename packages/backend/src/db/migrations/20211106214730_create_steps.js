export async function up(knex) {
  return knex.schema.createTable('steps', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').notNullable();
    table.string('app_key').notNullable();
    table.string('type').notNullable();
    table.uuid('connection_id').references('id').inTable('connections');
    table.text('parameters');

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('steps');
}
