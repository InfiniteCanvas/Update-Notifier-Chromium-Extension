<script>
	import '../app.css';

	let { children } = $props();
</script>

<style>
    :global(html) {
        min-width: 200px;
        min-height: 150px;
        width: 300px;
        height: 150px;
    }
</style>

{@render children()}
