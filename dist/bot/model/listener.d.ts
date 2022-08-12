export interface Listener {
    stop: () => void;
}
export declare const newListener: (stopListening: () => void) => Listener;
