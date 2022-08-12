export interface Logger {
    print: (...args: any) => void;
    log: (...args: any) => void;
    warn: (...args: any) => void;
    error: (...args: any) => void;
}
export declare const newLogger: (prefix: string) => Logger;
