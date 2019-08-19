'use strict';

const _ = require('lodash');

function generateRecommendedTeam(teamDatas) {
	const message = _.map(teamDatas, teamData => {
		const header = teamData.title;
		const duplicatedCharacters = teamData.duplicatedCharacter;
		// mark duplicated characters
		_.forEach(teamData.teams, team => {
			_.forEach(team.characters, (character, index) => {
				if (duplicatedCharacters.indexOf(character) !== -1) {
					team.characters[index] = `(${character})`; // special highlight for duplicated characters
				}
			});
		});
		const body = _.map(teamData.teams, team => {
			return `${team.boss}: ${team.characters.join()} / ${team.damage}`
		}).join('\n');
		const footer = `總分: ${teamData.totalScore}`;
		return `*${header}*\n${body}\n${footer}`;
	}).join('\n');
	return { message };
}

/**
 * Markdown format, used for normal text message
 * @param {Object} teamData
 * @return {{
 *     header: String,
 *     body: String | undefined,
 *     message: String
 * }}
 */
function generateMarkdownMessage(teamData) {
	const { boss, bossName, cycle, teams } = teamData;
	let header = `${boss}王 － *${cycle}*周目：冇隊`;
	if (teams.length < 1) return { header, message: header};
	header = `${boss}王：${bossName} － *${cycle}*周目\n`;
	const body = _.map(teams, team => {
		let bodyPart = (team.damage) ? `${team.characters.join()} / ${team.damage}` : team.characters.join();
		bodyPart = (team.videoReference) ? `[${bodyPart}🎞](${team.videoReference})` : bodyPart;
		bodyPart = (team.hardcoreTime) ? `${bodyPart}[⏱](${team.hardcoreTime})` : bodyPart;
		return bodyPart;
	}).join('\n');
	return {
		header,
		body,
		message: header + body
	};
}

/**
 * Plain text format, used for inline query
 * @param {Object} teamData
 * @return {{
 *     header: String,
 *     body: String | undefined,
 *     message: String
 * }}
 */
function generatePlainTextMessage(teamData) {
	const { boss, bossName, cycle, teams } = teamData;
	let header = `${boss}王 － ${cycle}周目：冇隊`;
	if (teams.length < 1) return { header, message: header};
	header = `${boss}王：${bossName} － ${cycle}周目\n`;
	const body = _.map(teams, team => {
		return (team.damage) ? `${team.characters.join()} / ${team.damage}` : team.characters.join();
	}).join('\n');
	return {
		header,
		body,
		message: header + body
	};
}

module.exports = {
	generateMarkdownMessage,
	generatePlainTextMessage,
	generateRecommendedTeam
};
