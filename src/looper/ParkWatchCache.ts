import { KeyedObject } from "../bot/model/KeyedObject"

interface WatchEntry {
    userId: string;
    userName: string;
    channelId: string;
}

const cache: KeyedObject<any> = {};

export const ParkWatchCache = {

}