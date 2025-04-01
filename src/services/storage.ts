import type { UserSettings } from '../types';

const STORAGE_KEY = 'f95zone_watchlist_settings';

export async function getUserSettings(): Promise<UserSettings> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(STORAGE_KEY, (result) => {
            const defaultSettings: UserSettings = {
                userHash: '',
                discordNotify: false
            };

            const settings = result[STORAGE_KEY] || defaultSettings;
            resolve(settings);
        });
    });
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ [STORAGE_KEY]: settings }, () => {
            resolve();
        });
    });
}

export function getCurrentThreadId(): string | null {
    const threadIdMatch = window.location.href.match(/threads\/.*\.(\d+)/);
    return threadIdMatch ? threadIdMatch[1] : null;
}
