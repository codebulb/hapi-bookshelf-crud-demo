'use strict';

const dbProperties = require('./dbProperties.js');

module.exports = {
  development: dbProperties,
  staging: dbProperties,
  production: dbProperties
};
