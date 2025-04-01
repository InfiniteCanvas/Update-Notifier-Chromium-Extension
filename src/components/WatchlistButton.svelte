<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchWatchlist, addGame, removeGame } from '../services/api';
    import { getUserSettings, saveUserSettings, getCurrentThreadId } from '../services/storage';
    import type { UserSettings } from '../types';

    export let showToast: (options: { type: string, message: string }) => void;

    let userSettings: UserSettings;
    let inWatchlist = false;
    let isLoading = true;
    let threadId = getCurrentThreadId();

    onMount(async () => {
        userSettings = await getUserSettings();
        await checkWatchlistStatus();
    });

    async function checkWatchlistStatus() {
        isLoading = true;

        if (userSettings.userHash && threadId) {
            const watchlist = await fetchWatchlist(userSettings.userHash);
            inWatchlist = watchlist.includes(Number(threadId));
        }

        isLoading = false;
    }

    async function handleUserHashChange(event: Event) {
        const input = event.target as HTMLInputElement;
        userSettings.userHash = input.value.trim();
        await saveUserSettings(userSettings);
        await checkWatchlistStatus();
    }

    async function handleNotificationChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        userSettings.discordNotify = checkbox.checked;
        await saveUserSettings(userSettings);
    }

    async function handleButtonClick() {
        if (!userSettings.userHash) {
            showToast({ type: 'error', message: 'Please enter a user hash' });
            return;
        }

        if (!threadId) {
            showToast({ type: 'error', message: 'Could not determine thread ID' });
            return;
        }

        isLoading = true;

        const requestData = {
            ThreadUrl: window.location.href,
            UserHash: userSettings.userHash,
            DiscordNotification: userSettings.discordNotify
        };

        let success: boolean;

        if (inWatchlist) {
            success = await removeGame(requestData);
            if (success) {
                showToast({ type: 'success', message: 'Game removed successfully!' });
                inWatchlist = false;
            } else {
                showToast({ type: 'error', message: 'Failed to remove game' });
            }
        } else {
            success = await addGame(requestData);
            if (success) {
                showToast({ type: 'success', message: 'Game added successfully!' });
                inWatchlist = true;
            } else {
                showToast({ type: 'error', message: 'Failed to add game' });
            }
        }

        isLoading = false;
    }
</script>

<div class="flex items-center space-x-2">
    <button
            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={handleButtonClick}
            disabled={isLoading || !threadId}
    >
        {#if isLoading}
            Loading...
        {:else if inWatchlist}
            Remove Game
        {:else}
            Add Game
        {/if}
    </button>

    <input
            type="text"
            placeholder="User Hash"
            class="px-2 py-1 border border-gray-300 rounded-md"
            value={userSettings?.userHash || ''}
            on:change={handleUserHashChange}
    />

    <label class="flex items-center cursor-pointer">
        <input
                type="checkbox"
                class="mr-1"
                checked={userSettings?.discordNotify || false}
                on:change={handleNotificationChange}
        />
        <span class="text-sm">Discord Notify</span>
    </label>
</div>

<style lang="postcss">
    /* Custom styles if needed */
</style>
