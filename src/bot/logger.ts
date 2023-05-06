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

const isDebug = process.env.BOT_ENV !== "production";

export interface Logger {
  print: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const logTag = function (prefix: string): string {
  return `<${prefix}>`;
};

export const newLogger = function (prefix: string): Logger {
  const tag = prefix ? logTag(prefix) : "";
  return {
    print: function print(...args: unknown[]) {
      console.log(tag, ...args);
    },

    log: function log(...args: unknown[]) {
      if (isDebug) {
        this.print(...args);
      }
    },

    warn: function warn(...args: unknown[]) {
      if (isDebug) {
        console.warn(tag, ...args);
      }
    },

    error: function error(e, ...args: unknown[]) {
      if (isDebug) {
        console.error(tag, e, ...args);
      }
    },
  };
};
