'use strict';

const getClanBossHelper = require('../../../get_clan_boss_team');
const responseMessageHandler = require('../../../response_message_handler');
const { defaultCycle } = require('../../../db_handler');
const { redive: { initDefaultCycle } } = require('../../../../config');

/**
 * Direct command query
 * example: /cb_1
 * @params {Object} msg - message object on Telebot event
 * @params {Object} props - props object on Telebot Regexp
 */
async function getClanBattleByCommand(msg, props) {
	const { id: chatID } = msg.chat;
	const userDefaultCycle = defaultCycle.getDefaultCycle(chatID) || initDefaultCycle;
	const [ , boss, , bossCycle = userDefaultCycle ] = props.match;
	const teamData = await getClanBossHelper.getByBoss(boss, bossCycle);
	const { message } = responseMessageHandler.generateMarkdownMessage(teamData);
	await msg.reply.text(message, {parseMode: 'markdown', webPreview: false});
}

module.exports = getClanBattleByCommand;
