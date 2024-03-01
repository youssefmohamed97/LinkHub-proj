export async function up(knex) {
  return knex.schema.createTable('executions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('flow_id').references('id').inTable('flows');
    table.boolean('test_run').notNullable().defaultTo(false);

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('executions');
}
