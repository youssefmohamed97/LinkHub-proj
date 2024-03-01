export async function up(knex) {
  return knex.schema.createTable('credentials', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').notNullable();
    table.string('display_name').notNullable();
    table.text('data').notNullable();
    table.uuid('user_id').references('id').inTable('users');
    table.boolean('verified').defaultTo(false);

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('credentials');
}
