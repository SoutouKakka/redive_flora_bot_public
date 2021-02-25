'use strict';

const getClanBossHelper = require('../../get_clan_boss_team');
const responseMessageHandler = require('../../response_message_handler');
const { sticker, defaultCycle } = require('../../db_handler');
const { redive: { initDefaultCycle } } = require('../../../config');

/**
 * Handle sticker query
 * @params {Object} msg - message object on Telebot event
 */
async function Sticker(msg) {
	const {
		chat: { id: chatID },
		sticker: {
			file_unique_id: stickerID
		}
	} = msg;
	// default sticker mapping for all chats
	const stickerMapping = {
		'AgADNgEAAs8QCgY': { boss: 1, bossCycle: 4},
		'AgADNwEAAs8QCgY': { boss: 2, bossCycle: 4},
		'AgADOAEAAs8QCgY': { boss: 3, bossCycle: 4},
		'AgADOQEAAs8QCgY': { boss: 4, bossCycle: 4},
		'AgADOgEAAs8QCgY': { boss: 5, bossCycle: 4},
		'AgADOwEAAs8QCgY': { boss: 1, bossCycle: 11},
		'AgADPAEAAs8QCgY': { boss: 2, bossCycle: 11},
		'AgADPQEAAs8QCgY': { boss: 3, bossCycle: 11},
		'AgADPgEAAs8QCgY': { boss: 4, bossCycle: 11},
		'AgADPwEAAs8QCgY': { boss: 5, bossCycle: 11},
		'AgADswIAAs8QCgY': { boss: 1, bossCycle: 35},
		'AgADtAIAAs8QCgY': { boss: 2, bossCycle: 35},
		'AgADtQIAAs8QCgY': { boss: 3, bossCycle: 35},
		'AgADtgIAAs8QCgY': { boss: 4, bossCycle: 35},
		'AgADtwIAAs8QCgY': { boss: 5, bossCycle: 35},
		'AgADiwkAAu-HwFE': { boss: 'teams' }
	};

	console.log(`Received sticker ID ${stickerID} from ${chatID}`);

	let boss, bossCycle;
	if (!stickerMapping[stickerID]) {
		// if stickerID is not found in default sticker mapping
		// check for custom sticker mapping
		const customSticker = sticker.getStickerBoss(chatID, stickerID);

		// return if no custom sticker found
		if (!customSticker) return;

		console.log(`Sticker ID ${stickerID} is custom sticker`);
		// get default cycle of a chat, if not set, user default in config
		let userDefaultCycle = defaultCycle.getDefaultCycle(chatID);
		bossCycle = userDefaultCycle || initDefaultCycle;
		boss = customSticker.boss;
	} else {
		console.log(`Sticker ID ${stickerID} is default sticker`);
		// get boss number and boss cycle from default sticker mapping
		boss = stickerMapping[stickerID].boss;
		bossCycle = stickerMapping[stickerID].bossCycle;
	}
	if (boss === 'teams') {
		// search for teams
		const teamData = await getClanBossHelper.getRecommended(11);

		// construct markdown message and respond to user
		const { message } = responseMessageHandler.generateRecommendedTeam(teamData);
		await msg.reply.text(message, {parseMode: 'markdown', webPreview: false});
	} else {
		// search for teams
		const teamData = await getClanBossHelper.getByBoss(boss, bossCycle);

		// construct markdown message and respond to user
		const { message } = responseMessageHandler.generateMarkdownMessage(teamData);
		await msg.reply.text(message, {parseMode: 'markdown', webPreview: false});
	}
}

module.exports = Sticker;
