<script>
	import { onMount } from 'svelte';
	import { getUserSettings, saveUserSettings } from '$lib/storage.svelte.js';

	/**
	 * @typedef {Object} UserSettings
	 * @property {string} userHash - The user's unique hash identifier
	 * @property {boolean} discordNotify - Whether discord notifications are enabled
	 */
	let settings = {
		userHash: '',
		discordNotify: false
	};

	let isSaving = false;
	let saveMessage = '';

	onMount(async () => {
		settings = await getUserSettings();
	});

	async function handleSubmit() {
		isSaving = true;
		saveMessage = '';

		try {
			await saveUserSettings(settings);
			saveMessage = 'Settings saved successfully!';
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			saveMessage = `Error saving settings: ${errorMessage}`;
			console.error('Failed to save settings:', error);
		} finally {
			isSaving = false;

			if (saveMessage === 'Settings saved successfully!') {
				setTimeout(() => {
					saveMessage = '';
				}, 3000);
			}
		}
	}
</script>

<div class="settings-form">
	<h2 class="text-xl font-bold mb-4">Update Notifier Settings</h2>

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div class="space-y-2">
			<label for="userHash" class="block font-medium">User Hash</label>
			<input
				type="text"
				id="userHash"
				bind:value={settings.userHash}
				class="w-full p-2 border border-gray-300 rounded"
				placeholder="Enter your user hash"
			/>
		</div>

		<div class="flex items-center">
			<input
				type="checkbox"
				id="discordNotify"
				bind:checked={settings.discordNotify}
				class="h-4 w-4"
			/>
			<label for="discordNotify" class="ml-2 block">
				Discord Add/Remove Feedback
			</label>
		</div>

		<button
			type="submit"
			class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
			disabled={isSaving}
		>
			{isSaving ? 'Saving...' : 'Save Settings'}
		</button>

		{#if saveMessage}
			<div
				class={`p-3 rounded ${saveMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
				{saveMessage}
			</div>
		{/if}
	</form>
</div>
