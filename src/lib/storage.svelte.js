/**
 * @typedef {Object} UserSettings
 * @property {string} userHash - The user's unique hash identifier
 * @property {boolean} discordNotify - Whether discord notifications are enabled
 */

const STORAGE_KEY = 'f95zone_watchlist_settings';

/**
 * Retrieves the user settings from Chrome storage
 * @returns {Promise<UserSettings>} The user's settings
 */
export async function getUserSettings() {
	return new Promise((resolve) => {
		chrome.storage.sync.get(STORAGE_KEY, (result) => {
			/** @type {UserSettings} */
			const defaultSettings = {
				userHash: '',
				discordNotify: false
			};

			const settings = result[STORAGE_KEY] || defaultSettings;
			resolve(settings);
		});
	});
}

/**
 * Saves the user settings to Chrome storage
 * @param {UserSettings} settings - The settings to save
 * @returns {Promise<void>}
 */
export async function saveUserSettings(settings) {
	return new Promise((resolve) => {
		chrome.storage.sync.set({ [STORAGE_KEY]: settings }, () => {
			resolve();
		});
	});
}

/**
 * Extracts the current thread ID from the URL
 * @returns {string|null} The current thread ID or null if not found
 */
export function getCurrentThreadId() {
	const threadIdMatch = window.location.href.match(/threads\/.*\.(\d+)/);
	return threadIdMatch ? threadIdMatch[1] : null;
}