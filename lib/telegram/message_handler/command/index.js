'use strict';

const getClanBattleByCommand = require('./cb');
const updateClanBattleDefault = require('./cbd');
const updateClanBattleSticker = require('./cbs');
const removeClanBattleSticker = require('./cbs_remove');

module.exports = {
	getClanBattleByCommand,
	updateClanBattleDefault,
	updateClanBattleSticker,
	removeClanBattleSticker
};
