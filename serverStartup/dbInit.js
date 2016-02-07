'use strict';

const knexCleaner = require('knex-cleaner');

module.exports = function (knex, onsuccess) {
    return knex.migrate.latest().then(function () {

        // We must use a 3rd party tool to clean the DB on startup
        knexCleaner.clean(knex).then(function () {
            knex.insert({
                name: "Max",
                address: "First Street",
                city: "Los Angeles",
                employment_status: "Unemployed",
            }).into('customer')
                    .then(function (row) {
                        knex.insert({
                            amount: 100,
                            date: new Date(),
                            customer_id: row[0],
                        }).into('payment').catch(failed);
                        knex.insert({
                            amount: 200,
                            customer_id: row[0],
                        }).into('payment').catch(failed);
                    }).then(function () {
                knex.insert({
                    name: "Sarah",
                    address: "Second Street",
                    city: "San Francisco",
                    employment_status: "Unemployed",
                }).into('customer')
                        .then(function (row) {
                            knex.insert({
                                amount: 100,
                                date: new Date(),
                                customer_id: row[0],
                            }).into('payment').catch(failed);
                        })
                        .then(onsuccess)
                        .catch(failed);
            })
            .catch(failed);
        });

        function failed(err) {
            console.log(err);
        }
    })
}