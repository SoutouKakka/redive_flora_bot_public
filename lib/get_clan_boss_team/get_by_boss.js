'use strict';

const _ = require('lodash');
const url = require('url');

const config = require('../../config');
const { getSheetData, tidyValueRange } = require('../google_sheet_helper');

// A1 notation of different boss teams
const bossConfig = {
	1: {
		4: 'A14:I29',
		11: 'J14:R29'
	},
	2: {
		4: 'A31:I46',
		11: 'J31:R46'
	},
	3: {
		4: 'A48:I63',
		11: 'J48:R63'
	},
	4: {
		4: 'A65:I80',
		11: 'J65:R80'
	},
	5: {
		4: 'A82:I97',
		11: 'J82:R97'
	}
};

/**
 * Parse clean sheet data to boss meta for further processing
 *
 * @param {cleanValueRange} cleanValueRange
 * @typedef {{
 *     bossName: String,
 *     damage: Number,
 *     characters: [String],
 *     videoReference: String,
 *     hardcoreTime: String
 * }} bossMeta
 * @return {bossMeta} bossMeta - some of the data needed for forming a complete bossData
 */
function processSheetData(cleanValueRange) {
	const { values: rows } = cleanValueRange;
	// filter out rows the bot does not need
	const usefulRows = _.compact(_.map(rows, row => {
		// return null if row value only contains boss name
		if (row.length <= 1) return null;
		const bossName = _.get(row, 0);
		const damage = _.get(row, 6);
		if (!bossName && !damage) return null;
		return row;
	}));
	// chunk rows to pair of 2, each pair belongs to 1 boss data
	const rowSets = _.chunk(usefulRows, 2);
	const bossMeta = _.map(rowSets, rowSet => {
		const [
			[ , , , , , , damage, videoReference, hardcoreTime ],
			[ bossName, ...characters ]
		] = rowSet;
		return {
			bossName,
			damage,
			characters,
			videoReference,
			hardcoreTime
		};
	});
	return bossMeta;
}

/**
 * Build complete boss data with all info needed for bot to sent out message
 *
 * @param {bossMeta} bossMeta
 * @param {Number} boss
 * @param {Number} cycle
 * @typedef {[String]} team - Array of character name
 * @typedef {{
 *     boss: Number,
 *     cycle: Number,
 *     bossName: String,
 *     teams: [team],
 *     videoReference: String | undefined,
 *     hardcoreTime: String | undefined
 * }} bossData
 * @return {bossData} bossData
 */
function buildCompleteBossData(bossMeta, boss, cycle) {
	const bossData = {
		boss,
		bossName: _.get(bossMeta, '0.bossName'),
		cycle,
		teams: []
	};
	bossData.teams = _.map(bossMeta, data => {
		const { characters, damage, videoReference, hardcoreTime } = data;
		const team = {
			characters,
			damage
		};
		if (videoReference && url.parse(videoReference).hostname) {
			team.videoReference = videoReference;
		}
		if (hardcoreTime) {
			team.hardcoreTime = `https://docs.google.com/spreadsheets/d/${config.redive.spreadsheetID}/edit#gid=${config.redive.hardcoreTimeSheetID}`;
		}
		return team;
	});
	return bossData;
}

/**
 * Get teams according to boss and cycle
 *
 * @param {Number} boss
 * @param {Number} cycle
 * @return {bossData}
 */
async function getClanBossTeams(boss, cycle) {
	console.log('Getting raw sheet data', { boss, cycle });
	const rawSheetData = await getSheetData(config.redive.spreadsheetID, _.get(bossConfig, [boss, cycle]));
	console.log('Get raw sheet data finished', { rawSheetData });
	try {
		const cleanValueRange = tidyValueRange(rawSheetData[0]);
		const bossMeta = processSheetData(cleanValueRange);
		console.log('Build boss meta finished');
		return buildCompleteBossData(bossMeta, boss, cycle);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

module.exports = getClanBossTeams;
