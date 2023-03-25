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

export enum MagicKeyType {
  DREAM = "dream-key-pass",
  BELIEVE = "believe-key-pass",
  ENCHANT = "enchant-key-pass",
  IMAGINE = "imagine-key-pass",
  INSPIRE = "inspire-key-pass",
  NONE = "",
}

export const allMagicKeys = function (): MagicKeyType[] {
  return [
    MagicKeyType.DREAM,
    MagicKeyType.BELIEVE,
    MagicKeyType.ENCHANT,
    MagicKeyType.IMAGINE,
    MagicKeyType.INSPIRE,
  ];
};

export const magicKeyName = function (key: MagicKeyType): string {
  switch (key) {
    case MagicKeyType.BELIEVE:
      return "Believe Key";
    case MagicKeyType.DREAM:
      return "Dream Key";
    case MagicKeyType.INSPIRE:
      return "Inspire Key";
    case MagicKeyType.ENCHANT:
      return "Enchant Key";
    case MagicKeyType.IMAGINE:
      return "Imagine Key";
    default:
      throw new Error(`Invalid MagicKey type: ${key}`);
  }
};
