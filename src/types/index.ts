export interface WatchlistGame {
    id: number;
}

export interface UserSettings {
    userHash: string;
    discordNotify: boolean;
}

export interface GameAddRequest {
    ThreadUrl: string;
    UserHash: string;
    DiscordNotification: boolean;
}

export interface ToastOptions {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}
