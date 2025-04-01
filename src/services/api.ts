import type { GameAddRequest } from '../types';

const API_BASE_URL = 'https://bot.infinitecanvas.io/api/v1';

export async function fetchWatchlist(userHash: string): Promise<number[]> {
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

export async function addGame(data: GameAddRequest): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.ok;
    } catch (error) {
        console.error('Error adding game:', error);
        return false;
    }
}

export async function removeGame(data: GameAddRequest): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/games`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.ok;
    } catch (error) {
        console.error('Error removing game:', error);
        return false;
    }
}
