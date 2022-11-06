"use strict";

const bot = require("./lib/telegram/bot/index").getBot();
const messageHandler = require("./lib/telegram/message_handler");

/**
 * Commands
 */
// Direct command query
bot.on(
  /^\/cb_([1-5])(r(4|11|31)|:(4|11|31))?$/i,
  messageHandler.command.getClanBattleByCommand
);

// Set chat default cycle
bot.on(/^\/cbd_(4|11|31)/, messageHandler.command.updateClanBattleDefault);

// Set chat custom sticker
bot.on(
  /^\/cbs_([1-5]|teams)$/i,
  messageHandler.command.updateClanBattleSticker
);

// Unset chat custom sticker
bot.on(/^\/cbs_remove$/i, messageHandler.command.removeClanBattleSticker);

// Recommended teams
bot.on(/^\/cb_teams/i, messageHandler.command.getClanTeamRecommendation);

// Handler for all stickers
bot.on("sticker", messageHandler.sticker);
