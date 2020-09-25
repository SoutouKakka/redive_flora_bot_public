'use strict';

const APP_ENV = process.env.APP_ENV;

const defaultConfig = require('./default');

module.exports = APP_ENV ? require(`./${APP_ENV}`) : defaultConfig;
