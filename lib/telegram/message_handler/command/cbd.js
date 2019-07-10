'use strict';

const { defaultCycle } = require('../../../db_handler');

/**
 * Set user default clan battle cycle
 * example: /cbd_4
 * @params {Object} msg - message object on Telebot event
 * @params {Object} props - props object on Telebot Regexp
 */
async function updateClanBattleDefault(msg, props) {
	const { id: chatID } = msg.chat;
	const [ , cycle ] = props.match;
	defaultCycle.setDefaultCycle(chatID, cycle);
	await msg.reply.text(`Default ${cycle} 周目`, {parseMode: 'markdown'});
}

module.exports = updateClanBattleDefault;
