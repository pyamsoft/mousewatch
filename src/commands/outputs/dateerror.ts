/*
 * Copyright 2025 pyamsoft
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

import { bold } from "../../bot/discord/format";

export const outputDateErrorText = function (dateString: string): string {
  return `:cry: Unable to figure out what date you want: "${bold(dateString)}"`;
};

export const outputDateMissingText = function (): string {
  return `:cry: You need to tell me a Date`;
};
