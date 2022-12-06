export enum MagicKeyType {
  DREAM = "dream-key-pass",
  BELIEVE = "believe-key-pass",
  ENCHANT = "enchant-key-pass",
  IMAGINE = "imagine-key-pass",
  INSPIRE = "inspire-key-pass",
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
