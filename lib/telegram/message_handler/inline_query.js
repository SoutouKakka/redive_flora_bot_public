'use strict';

const _ = require('lodash');
const uuid = require('uuid/v4');

const bot = require('../bot').getBot();
const getClanBoss = require('../../get_clan_boss_team');
const responseMessageHandler = require('../../response_message_handler');

/**
 * Inline query mode
 */
async function inlineQuery(msg) {
	let query = msg.query;
	const queryMatchResult = query.match(/^((clan_?(battle|boss)_?)|cb)?([1-5])$/i);
	const boss = _.get(queryMatchResult, '4', null);
	if (!boss) return;
	const teamData4 = await getClanBoss(boss, 4);
	const teamData11 = await getClanBoss(boss, 11);
	const team4Message = responseMessageHandler.generatePlainTextMessage(teamData4);
	const team11Message = responseMessageHandler.generatePlainTextMessage(teamData11);
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
	await bot.answerQuery(answers);
}

module.exports = inlineQuery;
