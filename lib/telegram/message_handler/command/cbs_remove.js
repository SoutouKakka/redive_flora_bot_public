"use strict";

const _ = require("lodash");

const { sticker } = require("../../../db_handler");

const bot = require("../../bot").getBot();

/**
 * Unset custom sticker mapping
 * example: /cbs_remove
 * @params {Object} msg - message object on Telebot event
 * @params {Object} props - props object on Telebot Regexp
 */
async function removeClanBattleSticker(msg) {
  const stickerID = _.get(msg, "reply_to_message.sticker.file_unique_id");
  const chatID = _.get(msg, "chat.id");
  if (!stickerID || !chatID) return;
  sticker.removeStickerBoss(chatID, stickerID);
  await bot.sendMessage(msg.chat.id, "Removed custom sticker", {
    parse_mode: "Markdown",
  });
}

module.exports = removeClanBattleSticker;
