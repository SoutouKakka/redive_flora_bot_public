"use strict";

const getClanBossHelper = require("../../../get_clan_boss_team");
const responseMessageHandler = require("../../../response_message_handler");

const bot = require("../../bot").getBot();

/**
 * Direct command query
 * example: /cb_1
 * @params {Object} msg - message object on Telebot event
 * @params {Object} props - props object on Telebot Regexp
 */
async function getClanTeamRecommendation(msg) {
  // const { id: chatID } = msg.chat;
  // const userDefaultCycle = defaultCycle.getDefaultCycle(chatID) || initDefaultCycle;
  const teamData = await getClanBossHelper.getRecommended(11); // only support 11th cycle
  const { message } = responseMessageHandler.generateRecommendedTeam(teamData);
  await bot.sendMessage(msg.chat.id, message, {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  });
}

module.exports = getClanTeamRecommendation;
