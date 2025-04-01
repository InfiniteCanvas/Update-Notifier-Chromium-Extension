<script lang="ts">
    import WatchlistButton from '../components/WatchlistButton.svelte';
    import ToastContainer from '../components/ToastContainer.svelte';
    import type { ToastOptions } from '../types';

    let toastContainerRef: { addToast: (options: ToastOptions) => void };

    function showToast(options: ToastOptions) {
        if (toastContainerRef) {
            toastContainerRef.addToast(options);
        }
    }
</script>

<ToastContainer bind:this={toastContainerRef} />
<WatchlistButton {showToast} />
