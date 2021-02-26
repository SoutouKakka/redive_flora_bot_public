'use strict';

const _ = require('lodash');
const request = require('request-promise');

const config = require('../../config');

/**
 * Get spreadsheet data using GoogleSheet API
 *
 * @param {String} spreadsheetID
 * @param {String} range
 * @typedef {[String]} spreadsheetRow
 * @typedef {{
 *     range: String,
 *     majorDimension: String,
 *     values: [spreadsheetRow]
 * }} valueRange
 * @return {[valueRange]}
 */
async function getSheetData(spreadsheetID, range, retryCount = 0) {
	console.log(`getSheetData attempt ${retryCount}`);

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
	const valueRanges = _.get(response, 'valueRanges'); // Raw response from Google Spreadsheet API

	if (
		!/#NAME/.test(JSON.stringify(valueRanges))
		&& !/Loading/.test(JSON.stringify(valueRanges))
		&& !/Unknown/.test(JSON.stringify(valueRanges))
	) {
		return valueRanges;
	} else if (retryCount < 3) {
		return await getSheetData(spreadsheetID, range, retryCount + 1);
	} else {
		// google API fucked up
		return null;
	}
}

/**
 * Remove empty or faulty array in a valueRange from GoogleSheet API：
 * - Sometimes GoogleSheet API will respond with #NAME? Unknown function ERROR in cell
 *
 * @param {valueRange} valueRange
 * @typedef {{
 *     range: String,
 *     values: spreadsheetRow
 * }} cleanValueRange
 * @return {cleanValueRange}
 */
function tidyValueRange(valueRange) {
	const { range, values } = valueRange;
	const cleanValues = _.map(values, value => {
		// return null if GoogleSheet API responded with function error
		if (/#NAME/.test(value[0])) return null;
		return value;
	});
	return {
		range,
		values: _.compact(cleanValues) // remove null values from array
	};
}

module.exports = {
	getSheetData,
	tidyValueRange
};
