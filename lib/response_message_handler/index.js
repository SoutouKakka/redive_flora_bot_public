'use strict';

const _ = require('lodash');

// Markdown format, used for normal text message
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

// Plain text format, used for inline query
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
	generatePlainTextMessage
};
