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
	/**
	 * Get which boss does the sticker in a chat refers to
	 * @param chatID
	 * @param stickerID
	 * @return {{
	 *     boss: String
	 * }}
	 */
	getStickerBoss: function(chatID, stickerID) {
		return stickerDB.get(`sticker_mapping.${chatID}.${stickerID}`).value();
	},
	/**
	 * Map a sticker ID in a chat to a boss
	 * @param chatID
	 * @param stickerID
	 * @param boss
	 */
	setStickerBoss: function(chatID, stickerID, boss) {
		stickerDB.set(`sticker_mapping.${chatID}.${stickerID}`, {boss})
			.write();
	},
	/**
	 * Un-map a sticker ID in a chat
	 * @param chatID
	 * @param stickerID
	 */
	removeStickerBoss: function(chatID, stickerID) {
		stickerDB.unset(`sticker_mapping.${chatID}.${stickerID}`)
		.write();
	}
};

const defaultCycle = {
	/**
	 * Get default cycle of a chat
	 * @param chatID
	 * @return {String}
	 */
	getDefaultCycle: function(chatID) {
		return defaultCycleDB.get(`default_cycle.${chatID}`).value();
	},
	/**
	 * Set default cycle of a chat
	 * @param chatID
	 * @param cycle
	 */
	setDefaultCycle: function(chatID, cycle) {
		defaultCycleDB.set(`default_cycle.${chatID}`, cycle)
		.write();
	}
};

module.exports = {
	sticker,
	defaultCycle
};
