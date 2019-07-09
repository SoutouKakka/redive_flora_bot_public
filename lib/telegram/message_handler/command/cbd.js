'use strict';

const { defaultCycle } = require('../../../db_handler');

/**
 * Set user default clan battle cycle
 * example: /cbd_4
 */
async function updateClanBattleDefault(msg, props) {
	const { id: chatID } = msg.chat;
	const [ , cycle ] = props.match;
	defaultCycle.setDefaultCycle(chatID, cycle);
	await msg.reply.text(`Default ${cycle} 周目`, {parseMode: 'markdown'});
}

module.exports = updateClanBattleDefault;
