'use strict';

const Telebot = require('telebot');

const config = require('../../../config/index');
const { telegram: {botToken} } = config;

const deubgBotToken = process.argv[2];
const bot = new Telebot(deubgBotToken || botToken);

function getBot() {
	return bot;
}

module.exports = {
	getBot
};
