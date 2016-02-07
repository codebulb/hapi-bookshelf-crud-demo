'use strict';

const Hapi = require('hapi');
const Joi = require('joi');

const dbProperties = require('./serverStartup/dbProperties.js');
const dbInit = require('./serverStartup/dbInit.js');

// Setup Bookshelf / Knex
const knex = require('knex')(dbProperties);
const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('virtuals')

// Setup Hapi
const server = new Hapi.Server();
server.connection({ routes: {cors: true }, port: 3000 });
const hapiCrud = require('hapi-bookshelf-crud')(server);


// Models ====================

const models = {
  Customer: bookshelf.Model.extend({
    tableName: 'customer',
    schema: {
      name: Joi.string().regex(/^[A-Za-z ]*$/).required(),
      employmentStatus: Joi.string().default('Unemployed'),
      payments: hapiCrud.empty(),
    },
  }),
  Payment: bookshelf.Model.extend({
    tableName: 'payment',
    schema: {
      amount: Joi.number().positive(),
      date: Joi.date().format('YYYY-MM-DD').allow(null),
    }
  })
}


// REST service endpoints ====================

hapiCrud.crud({
  bookshelfModel: models.Customer,
  basePath: '/customers',
});

hapiCrud.crud({
  bookshelfModel: models.Payment,
  basePath: '/customers/{customerId}/payments',
  baseQuery: function(request) {
    return {customerId: request.params.customerId}
  },
});


// Startup server ====================

server.start(() => dbInit(knex, function() {
  console.log('Server running at:', server.info.uri);
}));