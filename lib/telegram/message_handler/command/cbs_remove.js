'use strict';

const _ = require('lodash');

const { sticker } = require('../../../db_handler');

/**
 * Unset custom sticker mapping
 * example: /cbs_remove
 */
async function removeClanBattleSticker(msg) {
	const stickerID = _.get(msg, 'reply_to_message.sticker.file_id');
	const chatID = _.get(msg, 'chat.id');
	if (!stickerID || !chatID) return;
	sticker.removeStickerBoss(chatID, stickerID);
	await msg.reply.text('Removed custom sticker');
}

module.exports = removeClanBattleSticker;
