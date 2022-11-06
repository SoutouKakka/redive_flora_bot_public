"use strict";

const _ = require("lodash");

const { sticker } = require("../../../db_handler");

const bot = require("../../bot").getBot();

/**
 * Set custom sticker mapping
 * example: /cbs_1
 * @params {Object} msg - message object on Telebot event
 * @params {Object} props - props object on Telebot Regexp
 */
async function updateClanBattleSticker(msg, props) {
  const { id: chatID } = msg.chat;
  const [, actionName] = props.match;
  const stickerID = _.get(msg, "reply_to_message.sticker.file_unique_id");
  if (!stickerID || !chatID) {
    await bot.sendMessage(msg.chat.id, "Cannot find sticker ID", {
      parse_mode: "Markdown",
    });
    return;
  }
  sticker.setStickerBoss(chatID, stickerID, actionName);
  const savedSticker = sticker.getStickerBoss(chatID, stickerID);
  await bot.sendMessage(
    msg.chat.id,
    `Custome sticker set, Action: ${savedSticker.boss}`,
    {
      parse_mode: "Markdown",
    }
  );
}

module.exports = updateClanBattleSticker;
