/**
 * @typedef {Object} GameAddRequest
 * @property {string} ThreadUrl - URL of the thread for the game
 * @property {string} UserHash - User's unique hash identifier
 * @property {boolean} DiscordNotification - Whether to notify via Discord
 */

/**
 * @typedef {Object} UserSettings
 * @property {string} userHash - The user's unique hash identifier
 * @property {boolean} discordNotify - Whether discord notifications are enabled
 */

const API_BASE_URL = 'https://bot.infinitecanvas.io/api/v1';
const WATCHLIST_KEY = 'f95zone_watchlist';
const STORAGE_KEY = 'f95zone_watchlist_settings';

/**
 * Retrieves the user settings from Chrome storage
 * @returns {Promise<UserSettings>} The user's settings
 */
async function getUserSettings() {
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
 * Fetches the user's game watchlist
 * @param {string} userHash - The unique hash for the user
 * @returns {Promise<Array<Number>>} List of games in the user's watchlist
 */
async function fetchWatchlist(userHash) {
	if (!userHash) return [];

	try {
		const response = await fetch(`${API_BASE_URL}/games?userHash=${encodeURIComponent(userHash)}`);

		if (!response.ok) {
			throw new Error(`API error: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching watchlist:', error);
		return [];
	}
}

/**
 * Adds a game to the user's watchlist
 * @param {GameAddRequest} data - The game data to be added
 * @returns {Promise<boolean>} Whether the operation was successful
 */
async function addGame(data) {
	try {
		const response = await fetch(`${API_BASE_URL}/games`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		console.log(await response.text());
		return response.ok;
	} catch (error) {
		console.error('Error adding game:', error);
		return false;
	}
}

/**
 * Removes a game from the user's watchlist
 * @param {GameAddRequest} data - The game data to be removed
 * @returns {Promise<boolean>} Whether the operation was successful
 */
async function removeGame(data) {
	try {
		const response = await fetch(`${API_BASE_URL}/games`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		console.log(await response.text());
		return response.ok;
	} catch (error) {
		console.error('Error removing game:', error);
		return false;
	}
}

/**
 * @returns {Promise<Array<Number>>}
 */
async function getUserGames() {
	return new Promise((resolve) => {
		chrome.storage.sync.get(WATCHLIST_KEY, (result) => {
			/** @type {Array<Number>} */
			const defaultGames = [];

			const games = result[WATCHLIST_KEY] || defaultGames;
			resolve(games);
		});
	});
}

/**
 * @param {Array<Number>} games
 */
async function saveUserGames(games) {
	return new Promise((resolve) => {
		chrome.storage.sync.set({ [WATCHLIST_KEY]: games }, () => {
			resolve();
		});
	});
}

/**
 * Gets the current thread ID from the URL
 * @returns {string|null} - The thread ID or null if not found
 */
function getCurrentThreadId() {
	const threadIdMatch = window.location.href.match(/threads\/.*\.(\d+)/);
	return threadIdMatch ? threadIdMatch[1] : null;
}

/**
 * Injects a dynamic watchlist button into the page
 */
async function injectWatchlistUI() {
	// Wait for the page to fully load

	// Find the button group where we want to inject our UI
	const buttonGroup = document.querySelector('.block-outer-opposite');
	if (!buttonGroup) {
		console.log('Button group not found. Unable to add game button.');
		return;
	}

	const button = document.createElement('button');
	button.className = 'button--link button rippleButton';
	button.id = 'f95zone-watchlist-manager';
	button.textContent = 'Loading...';

	// Get current thread ID
	const threadId = getCurrentThreadId();
	if (!threadId) {
		console.log('Could not extract thread ID from URL.');
		return;
	}

	// Get user settings and hash
	const userSettings = await getUserSettings();
	const discordNotify = userSettings.discordNotify;
	const userHash = userSettings.userHash;

	const cachedWatchlist = await getUserGames();
	let isInWatchlist = cachedWatchlist.some((game) => game.toString() === threadId);
	if (!isInWatchlist) {
		// Fetch the current watchlist
		console.log(threadId + ' was not found in cached list: ' + cachedWatchlist.join(', '));
		const watchlist = await fetchWatchlist(userHash);
		await saveUserGames(watchlist);

		// Check if current thread is in the watchlist
		isInWatchlist = watchlist.some((game) => game.toString() === threadId);
		if (isInWatchlist)
			console.log(threadId + ' was not in cache but on remote. How?\n' + watchlist.join(', '));
	} else {
		console.log(threadId + ' was found in cached watchlist.');
	}

	button.textContent = isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';

	// Add appropriate click event listener
	button.addEventListener('click', async () => {
		const threadUrl = window.location.href;

		if (isInWatchlist) {
			button.textContent = 'Removing...';
			const success = await removeGame({
				ThreadUrl: threadUrl,
				UserHash: userHash,
				DiscordNotification: discordNotify
			});

			if (success) {
				const tempList = (await getUserGames()).filter((game) => game.toString() !== threadId);
				await saveUserGames(tempList);
				button.textContent = 'Add to Watchlist';
				updateButtonFunction(button, threadUrl, threadId, userSettings, false);
			} else {
				button.textContent = 'Remove from Watchlist';
			}
		} else {
			button.textContent = 'Adding...';
			const success = await addGame({
				ThreadUrl: threadUrl,
				UserHash: userHash,
				DiscordNotification: discordNotify
			});

			if (success) {
				const tempList = await getUserGames();
				tempList.push(+threadId);
				await saveUserGames(tempList);
				button.textContent = 'Remove from Watchlist';
				updateButtonFunction(button, threadUrl, threadId, userSettings, true);
			} else {
				button.textContent = 'Add to Watchlist';
			}
		}
	});

	buttonGroup.appendChild(button);
}

/**
 * Updates the button's functionality after state change
 */
function updateButtonFunction(button, threadUrl, threadId, userSettings, isInWatchlist) {
	// Clone the button to remove old event listeners
	const discordNotify = userSettings.discordNotify;
	const userHash = userSettings.userHash;
	const newButton = button.cloneNode(true);
	button.parentNode.replaceChild(newButton, button);

	newButton.addEventListener('click', async () => {
		if (isInWatchlist) {
			button.textContent = 'Removing...';
			const success = await removeGame({
				ThreadUrl: threadUrl,
				UserHash: userHash,
				DiscordNotification: discordNotify
			});

			if (success) {
				const tempList = (await getUserGames()).filter((game) => game.toString() !== threadId);
				await saveUserGames(tempList);
				newButton.textContent = 'Add to Watchlist';
				updateButtonFunction(newButton, threadUrl, threadId, userHash, false);
			} else {
				button.textContent = 'Remove from Watchlist';
			}
		} else {
			button.textContent = 'Adding...';
			const success = await addGame({
				ThreadUrl: threadUrl,
				UserHash: userHash,
				DiscordNotification: discordNotify
			});

			if (success) {
				const tempList = await getUserGames();
				tempList.push(+threadId);
				await saveUserGames(tempList);
				newButton.textContent = 'Remove from Watchlist';
				updateButtonFunction(newButton, threadUrl, threadId, userHash, true);
			} else {
				button.textContent = 'Add to Watchlist';
			}
		}
	});
}

injectWatchlistUI().then(() => console.log('Injected!'));
