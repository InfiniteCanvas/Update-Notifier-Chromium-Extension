import App from './App.svelte';

function injectWatchlistUI() {
  // Wait for the page to fully load
  setTimeout(() => {
    // Find the button group where we want to inject our UI
    const buttonGroup = document.querySelector('.buttonGroup');

    if (!buttonGroup) {
      console.log('Button group not found. Unable to add game button.');
      return;
    }

    // Create container for our Svelte app
    const container = document.createElement('div');
    container.id = 'f95zone-watchlist-manager';
    buttonGroup.appendChild(container);

    // Mount Svelte app
    new App({
      target: container
    });
  }, 1000);
}

// Start the injection process
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectWatchlistUI);
} else {
  injectWatchlistUI();
}
