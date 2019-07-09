'use strict';

const getClanBoss = require('../../get_clan_boss_team');
const responseMessageHandler = require('../../response_message_handler');
const { sticker, defaultCycle } = require('../../db_handler');
const { redive: { initDefaultCycle } } = require('../../../config');

/**
 * Handle sticker query
 */
async function Sticker(msg) {
	const {
		chat: { id: chatID },
		sticker: {
			file_id: stickerID
		}
	} = msg;
	const stickerMapping = {
		// transparent stickers
		'CAADBAADNgEAAs8QCgY3F6WVp7OXCAI': { boss: 1, bossCycle: 4},
		'CAADBAADNwEAAs8QCgYjIhlpvaFfSgI': { boss: 2, bossCycle: 4},
		'CAADBAADOAEAAs8QCgbvi8OwCCG1rgI': { boss: 3, bossCycle: 4},
		'CAADBAADOQEAAs8QCgaD3WompG6KSgI': { boss: 4, bossCycle: 4},
		'CAADBAADOgEAAs8QCgYa1sR_9b1LNQI': { boss: 5, bossCycle: 4},
		'CAADBAADOwEAAs8QCgZMUy3q4ZMLWgI': { boss: 1, bossCycle: 11},
		'CAADBAADPAEAAs8QCga00epv_7r57wI': { boss: 2, bossCycle: 11},
		'CAADBAADPQEAAs8QCgaETob6Nz46NwI': { boss: 3, bossCycle: 11},
		'CAADBAADPgEAAs8QCgYYY9ApIWQrlAI': { boss: 4, bossCycle: 11},
		'CAADBAADPwEAAs8QCgYgYJ9rGcpEIgI': { boss: 5, bossCycle: 11}
	};
	let boss, bossCycle;
	if (!stickerMapping[stickerID]) { // if not default sticker pack, check for custom sticker mapping
		const customSticker = sticker.getStickerBoss(chatID, stickerID);
		if (!customSticker) return;
		let userDefaultCycle = defaultCycle.getDefaultCycle(chatID);
		bossCycle = userDefaultCycle || initDefaultCycle;
		boss = customSticker.boss;
	} else {
		boss = stickerMapping[stickerID].boss;
		bossCycle = stickerMapping[stickerID].bossCycle;
	}
	const teamData = await getClanBoss(boss, bossCycle);
	const { message } = responseMessageHandler.generateMarkdownMessage(teamData);
	await msg.reply.text(message, {parseMode: 'markdown', webPreview: false});
}

module.exports = Sticker;
