import { MagicKeyType } from "../commands/model/MagicKeyType";
import { WatchEntry } from "../commands/model/WatchEntry";
import { WatchResult } from "../commands/model/WatchResult";
import { KeyedObject } from "../bot/model/KeyedObject";

export const ParkCalendarLookupHandler = {
  lookup: function (
    magicKey: MagicKeyType,
    entries: WatchEntry[]
  ): KeyedObject<WatchResult> {
    return {};
  },
};
