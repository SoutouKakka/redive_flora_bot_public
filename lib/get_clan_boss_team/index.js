'use strict';

const _ = require('lodash');
const request = require('request-promise');
const url = require('url');

const config = require('../../config');

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
 * Get spreadsheet data using GoogleSheet API
 */
async function getSheetData(spreadsheetID, range) {
	const response = await request({
		url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values:batchGet`,
		method: 'GET',
		qs: {
			key: config.google.spreadsheetApiKey,
			ranges: `${config.redive.bossTeamSheetName}!${range}`,
			majorDimension: 'ROWS',
			valueRenderOption: 'UNFORMATTED_VALUE',
			dateTimeRenderOption: 'SERIAL_NUMBER'
		},
		json: true
	});
	return _.get(response, 'valueRanges'); // Raw response from Google Spreadsheet API
}

/**
 * Remove empty or faulty array in valueRanges from GoogleSheet API
 */
function tidySheetData(valueRange) {
	const { range, values } = valueRange;
	const cleanValues = _.map(values, value => {
		// return null if row value only contains boss name
		if (value.length <= 1) return null;
		// return null if GoogleSheet API responded with function error
		if (/#NAME/.test(value[0])) return null;
		// return row
		return value;
	});
	return {
		range,
		values: _.compact(cleanValues) // remove null values from array
	};
}

/**
 * Parse clean sheet data to boss meta for further processing
 */
function processSheetData(cleanSheetData) {
	const { values: rows } = cleanSheetData;
	// chunk rows to pair of 2, each pair belongs to 1 boss data
	const rowSets = _.chunk(rows, 2);
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
 * Get teams for a boss
 */
async function getClanBossTeams(boss, cycle) {
	const rawSheetData = await getSheetData(config.redive.spreadsheetID, _.get(bossConfig, [boss, cycle]));
	const cleanSheetData = tidySheetData(rawSheetData[0]);
	const bossMeta = processSheetData(cleanSheetData);
	return buildCompleteBossData(bossMeta, boss, cycle);
}

module.exports = getClanBossTeams;
