"use strict";

const TelegramBot = require("node-telegram-bot-api");

const config = require("../../../config/index");
const {
  telegram: { botToken },
} = config;

const deubgBotToken = process.argv[2];
const bot = new TelegramBot(deubgBotToken || botToken, {
  polling: {
    interval: 10000, // Optional. How often check updates (in ms).npm
    params: {
      // Optional. Use polling.
      timeout: 20, // Optional. Update polling timeout (0 - short polling).
    },
  },
});

function getBot() {
  return bot;
}

module.exports = {
  getBot,
};
