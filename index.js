'use strict';

const bot = require('./lib/telegram/bot/index').getBot();
const messageHandler = require('./lib/telegram/message_handler');

bot.start();

/**
 * Commands
 */
// Direct command query
bot.on(/^\/cb_([1-5])(r(4|11)|:(4|11))?$/i, messageHandler.command.getClanBattleByCommand);

// Set chat default cycle
bot.on(/^\/cbd_(4|11)/, messageHandler.command.updateClanBattleDefault);

// Set chat custom sticker
bot.on(/^\/cbs_([1-5])$/i, messageHandler.command.updateClanBattleSticker);

// Unset chat custom sticker
bot.on(/^\/cbs_remove$/i, messageHandler.command.removeClanBattleSticker);


/**
 * Others
 */
// Handler for inline mode
bot.on('inlineQuery', messageHandler.inlineQuery);

// Handler for all stickers
bot.on('sticker', messageHandler.sticker);

/**
 * Errors
 */
bot.on('error', async (err) => {
	const {data: msg} = err;
	if (!msg) return;
	await msg.reply.text('出事了');
});
