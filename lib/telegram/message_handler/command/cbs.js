'use strict';

const _ = require('lodash');

const { sticker } = require('../../../db_handler');

/**
 * Set custom sticker mapping
 * example: /cbs_1
 */
async function updateClanBattleSticker(msg, props) {
	const { id: chatID } = msg.chat;
	const [ , boss ] = props.match;
	const stickerID = _.get(msg, 'reply_to_message.sticker.file_id');
	if (!stickerID || !chatID) {
		await msg.reply.text('Cannot find sticker ID');
		return;
	}
	sticker.setStickerBoss(chatID, stickerID, boss);
	const savedSticker = sticker.getStickerBoss(chatID, stickerID);
	await msg.reply.text(`Custome sticker set, ${savedSticker.boss}王`);
}

module.exports = updateClanBattleSticker;
