'use strict';

const _ = require('lodash');
const uuid = require('uuid/v4');

const bot = require('../bot').getBot();
const getClanBossHelper = require('../../get_clan_boss_team');
const responseMessageHandler = require('../../response_message_handler');

/**
 * Inline query mode
 * @params {Object} msg - message object on Telebot event
 */
async function inlineQuery(msg) {
	// identify which boss is the user querying
	let query = msg.query;
	const queryMatchResult = query.match(/^((clan_?(battle|boss)_?)|cb)?([1-5])$/i);
	const boss = _.get(queryMatchResult, '4', null);
	if (!boss) return;

	// search for both 4th and 11th cycle for teams
	const teamData4 = await getClanBossHelper.getByBoss(boss, 4);
	const teamData11 = await getClanBossHelper.getByBoss(boss, 11);
	const teamData31 = await getClanBossHelper.getByBoss(boss, 31);

	// construct plain text message for inline query
	const team4Message = responseMessageHandler.generatePlainTextMessage(teamData4);
	const team11Message = responseMessageHandler.generatePlainTextMessage(teamData11);
	const team31Message = responseMessageHandler.generatePlainTextMessage(teamData31);

	// respond teams to user
	const answers = bot.answerList(msg.id, {cacheTime: 10});
	if (teamData4.teams.length > 0) {
		answers.addArticle({
			id: `redive_flora_bot_${uuid()}`,
			title: '4周目',
			description: team4Message.body,
			message_text: team4Message.message
		});
	}
	if (teamData11.teams.length > 0) {
		answers.addArticle({
			id: `redive_flora_bot_${uuid()}`,
			title: '11周目',
			description: team11Message.body,
			message_text: team11Message.message
		});
	}
	if (teamData31.teams.length > 0) {
		answers.addArticle({
			id: `redive_flora_bot_${uuid()}`,
			title: '31周目',
			description: team31Message.body,
			message_text: team31Message.message
		});
	}
	await bot.answerQuery(answers);
}

module.exports = inlineQuery;
