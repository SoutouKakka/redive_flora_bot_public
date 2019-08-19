'use strict';

const _ = require('lodash');

const config = require('../../config');
const { getSheetData, tidyValueRange } = require('../google_sheet_helper');

// A1 notation for team recommendation
const a1Notation = {
	11: 'J100:S110'
};

function formRecommendedTeamObject(teamRow) {
	const [boss, bossName, chara1, chara2, chara3, chara4, chara5, damage, scoreRatio, score] = teamRow;
	return {
		boss: boss,
		bossName: bossName,
		characters: [chara1, chara2, chara3, chara4, chara5],
		damage: damage,
		scoreRatio: scoreRatio,
		score
	};
}

function processSheetData(cleanValueRange) {
	// remove blank rows
	const rows = _.compact(_.map(cleanValueRange.values, row => {
		if (row.length === 0) return null;
		return row;
	}));
	// chunk per 5 rows
	const recommended = _.compact(_.map(_.chunk(rows, 5), chunkedRows => {
		if (chunkedRows.length < 5) return null;
		const [
			[title1, title2],
			teamRow1,
			teamRow2,
			teamRow3,
			[, , , , , , , totalDamage, , totalScore]
		] = chunkedRows;
		const teamCharacter = [
			formRecommendedTeamObject(teamRow1),
			formRecommendedTeamObject(teamRow2),
			formRecommendedTeamObject(teamRow3)
		];
		// idendify duplicated characters (for highlighting later on)
		const characterUsed = {};
		_.forEach(_.concat(teamCharacter[0].characters, teamCharacter[1].characters, teamCharacter[2].characters), character => {
			if (characterUsed[character] === undefined) {
				characterUsed[character] = 0;
			} else {
				characterUsed[character] ++;
			}
		});
		const duplicatedCharacter = [];
		_.forEach(characterUsed, (used, character) =>{
			if (used > 0) {
				duplicatedCharacter.push(character);
			}
		});
		const recommemdedTeam = {
			title: `${title1} ${title2}`,
			teams: teamCharacter,
			duplicatedCharacter,
			totalDamage,
			totalScore
		};
		return recommemdedTeam;
	}));
	return recommended;
}

/**
 * Get recommended teams
 *
 * @param {Number} cycle
 * @return {bossData}
 */
async function getClanRecommendedTeams(cycle) {
	try {
		const rawSheetData = await getSheetData(config.redive.spreadsheetID, _.get(a1Notation, cycle));
		const cleanValueRange = tidyValueRange(rawSheetData[0]);
		const teamMeta = processSheetData(cleanValueRange);
		return teamMeta;
		// return buildCompleteBossData(bossMeta, boss, cycle);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

module.exports = getClanRecommendedTeams;
