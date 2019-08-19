'use strict';

const getClanBattleByCommand = require('./cb');
const updateClanBattleDefault = require('./cbd');
const updateClanBattleSticker = require('./cbs');
const removeClanBattleSticker = require('./cbs_remove');
const getClanTeamRecommendation = require('./cb_teams');

module.exports = {
	getClanBattleByCommand,
	updateClanBattleDefault,
	updateClanBattleSticker,
	removeClanBattleSticker,
	getClanTeamRecommendation
};
