<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import ToastNotification from './ToastNotification.svelte';
    import type { ToastOptions } from '../types';

    let toasts: (ToastOptions & { id: number })[] = [];
    let nextId = 0;

    // Create a custom event handler to show toasts
    function handleToastEvent(event: CustomEvent) {
        const toastOptions = event.detail;
        addToast(toastOptions);
    }

    function addToast(options: ToastOptions) {
        const id = nextId++;
        toasts = [...toasts, { ...options, id }];

        // Auto-remove toast after duration
        setTimeout(() => {
            toasts = toasts.filter(t => t.id !== id);
        }, options.duration || 5000);
    }

    // Export the addToast function
    export { addToast };

    onMount(() => {
        window.addEventListener('show-toast', handleToastEvent as EventListener);
    });

    onDestroy(() => {
        window.removeEventListener('show-toast', handleToastEvent as EventListener);
    });
</script>

<div class="fixed top-5 right-5 z-50 space-y-2">
    {#each toasts as toast (toast.id)}
        <ToastNotification
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
        />
    {/each}
</div>
