<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';

    export let message: string;
    export let type: 'success' | 'error' | 'warning' | 'info' = 'success';
    export let duration: number = 5000;

    let visible = true;
    let timer: number;

    onMount(() => {
        timer = window.setTimeout(() => {
            visible = false;
        }, duration);
    });

    onDestroy(() => {
        clearTimeout(timer);
    });
</script>

{#if visible}
    <div
            transition:fade={{ duration: 300 }}
            class={`text-white p-3 rounded-md shadow-md flex items-center max-w-xs ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`}
    >
    <span class="mr-2 font-bold">
      {#if type === 'success'}✓
      {:else if type === 'error'}✗
      {:else if type === 'warning'}⚠
      {:else}ℹ{/if}
    </span>
        <span>{message}</span>
    </div>
{/if}

<style lang="postcss">
    /* Custom styles if needed */
</style>
