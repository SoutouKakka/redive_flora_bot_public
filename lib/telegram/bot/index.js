'use strict';

const Telebot = require('telebot');

const config = require('../../../config/index');
const { telegram: {botToken} } = config;

const deubgBotToken = process.argv[2];
const bot = new Telebot({
	token: deubgBotToken || botToken,
	polling: {
    // Optional. Use polling.
    interval: 1000, // Optional. How often check updates (in ms).npm
    timeout: 10, // Optional. Update polling timeout (0 - short polling).
    limit: 100, // Optional. Limits the number of updates to be retrieved.
    retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
  },
});

function getBot() {
	return bot;
}

module.exports = {
	getBot
};
