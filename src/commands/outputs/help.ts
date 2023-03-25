/*
 * Copyright 2023 pyamsoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BotConfig } from "../../config";
import { codeBlock } from "../../bot/discord/format";

export const outputHelpText = function (config: BotConfig): string {
  const { prefix } = config;

  return codeBlock(`
Beep Boop.

[COMMANDS]
${prefix}                   This help
${prefix} help              This help
${prefix} status            Prints the status of the bot

${prefix} show <DATE>       Show park availability for a DATE
${prefix} watch <DATE>      Watch park availability for a DATE
${prefix} stop <DATE>       Stop watching a DATE
${prefix} cancel            Cancel all pending watch commands

[NOTES]
DATE must look like MM/DD/YYYY

  01/12/2023
  12/14/2022
  12/06/2023

[EXAMPLE]

  me >  ${prefix} show 01/24/2023

  bot > Tue, Jan 24, 2023: Inspire Key
        reservations are AVAILABLE
        https://disneyland.disney.go.com/entry-reservation/

  me >  ${prefix} watch 01/04/2021

  bot > :thumbsup: Watching Inspire Key
        reservations on Sun, Dec 18, 2022

  * A few minutes later... *

  bot > @You Sun, Dec 18, 2022: Inspire Key
        reservations are AVAILABLE
        https://disneyland.disney.go.com/entry-reservation/

        (React to this message with an emoji to stop
         watching, otherwise I will assume you did
         not get a reservation spot, and will keep
         watching.)
`);
};
