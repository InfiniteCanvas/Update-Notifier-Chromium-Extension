import { json } from '@sveltejs/kit';

export const prerender = false;
const API_BASE_URL = 'https://bot.infinitecanvas.io/api/v1';

/**
 * Handles GET requests to fetch a user's watchlist
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export async function GET({ url }) {
	const userHash = url.searchParams.get('userHash');

	if (!userHash) {
		return json([], { status: 400 });
	}

	try {
		const response = await fetch(`${API_BASE_URL}/games?userHash=${encodeURIComponent(userHash)}`);

		if (!response.ok) {
			throw new Error(`API error: ${response.statusText}`);
		}

		const data = await response.json();
		return json(data);
	} catch (error) {
		console.error('Error fetching watchlist:', error);
		return json([], { status: 500 });
	}
}

/**
 * Handles POST requests to add a game to the watchlist
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export async function POST({ request }) {
	try {
		const data = await request.json();

		const response = await fetch(`${API_BASE_URL}/games`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		return new Response(null, {
			status: response.ok ? 200 : 400
		});
	} catch (error) {
		console.error('Error adding game:', error);
		return new Response(null, { status: 500 });
	}
}

/**
 * Handles DELETE requests to remove a game from the watchlist
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export async function DELETE({ request }) {
	try {
		const data = await request.json();

		const response = await fetch(`${API_BASE_URL}/games`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		return new Response(null, {
			status: response.ok ? 200 : 400
		});
	} catch (error) {
		console.error('Error removing game:', error);
		return new Response(null, { status: 500 });
	}
}
