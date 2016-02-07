
exports.up = function (knex, Promise) {
    // Note: Apparently, dropTableIfExists has no effect. See dbInit.js file.
    return knex.schema.dropTableIfExists('payment')
            .dropTableIfExists('customer')

            .createTable('customer', function (table) {
                table.bigIncrements('id').primary();
                table.string('name').notNullable();
                table.string('address');
                table.string('city');
                table.string('employment_status').notNullable();
                table.string('company_name');
            })
            .createTable('payment', function (table) {
                table.bigIncrements('id').primary();
                table.bigInteger('customer_id').unsigned().references('customer.id')
                table.integer('amount').notNullable();
                table.date('date');
            });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('payment')
            .dropTable('customer');
};
