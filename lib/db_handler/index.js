'use strict';

// Small JSON database
const root = require('app-root-path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const stickerDB = low(new FileSync(`${root}/db/sticker.json`));
const defaultCycleDB = low(new FileSync(`${root}/db/default_cycle.json`));
stickerDB.defaults({
	sticker_mapping: {}
}).write();
defaultCycleDB.defaults({
	default_cycle: {}
}).write();

const sticker = {
	getStickerBoss: function(chatID, stickerID) {
		return stickerDB.get(`sticker_mapping.${chatID}.${stickerID}`).value();
	},
	setStickerBoss: function(chatID, stickerID, boss) {
		stickerDB.set(`sticker_mapping.${chatID}.${stickerID}`, {boss})
			.write();
	},
	removeStickerBoss: function(chatID, stickerID) {
		stickerDB.unset(`sticker_mapping.${chatID}.${stickerID}`)
		.write();
	}
};

const defaultCycle = {
	getDefaultCycle: function(chatID) {
		return defaultCycleDB.get(`default_cycle.${chatID}`).value();
	},
	setDefaultCycle: function(chatID, cycle) {
		defaultCycleDB.set(`default_cycle.${chatID}`, cycle)
		.write();
	}
};

module.exports = {
	sticker,
	defaultCycle
};
