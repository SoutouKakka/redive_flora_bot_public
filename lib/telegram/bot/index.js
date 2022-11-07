"use strict";

const TelegramBot = require("node-telegram-bot-api");

const config = require("../../../config/index");
const {
  telegram: { botToken },
} = config;

const deubgBotToken = process.argv[2];
const bot = new TelegramBot(deubgBotToken || botToken, {
  polling: {
    interval: 5000, // Optional. How often check updates (in ms).npm
    params: {
      // Optional. Use polling.
      timeout: 10, // Optional. Update polling timeout (0 - short polling).
      limit: 100, // Optional. Limits the number of updates to be retrieved.
    },
  },
});

function getBot() {
  return bot;
}

module.exports = {
  getBot,
};
