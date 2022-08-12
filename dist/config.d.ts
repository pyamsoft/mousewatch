export interface BotConfig {
    prefix: string;
    token: string;
    specificChannel: string;
}
export declare const sourceConfig: () => BotConfig;
