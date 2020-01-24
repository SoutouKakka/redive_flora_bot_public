'use strict';

const _ = require('lodash');

const { sticker } = require('../../../db_handler');

/**
 * Set custom sticker mapping
 * example: /cbs_1
 * @params {Object} msg - message object on Telebot event
 * @params {Object} props - props object on Telebot Regexp
 */
async function updateClanBattleSticker(msg, props) {
	const { id: chatID } = msg.chat;
	const [ , actionName ] = props.match;
	const stickerID = _.get(msg, 'reply_to_message.sticker.file_unique_id');
	if (!stickerID || !chatID) {
		await msg.reply.text('Cannot find sticker ID');
		return;
	}
	sticker.setStickerBoss(chatID, stickerID, actionName);
	const savedSticker = sticker.getStickerBoss(chatID, stickerID);
	await msg.reply.text(`Custome sticker set, Action: ${savedSticker.boss}`);
}

module.exports = updateClanBattleSticker;
