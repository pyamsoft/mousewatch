export const ensureArray = function <T>(oneOrMany: T | T[]): T[] {
  let list;
  if (Array.isArray(oneOrMany)) {
    list = oneOrMany;
  } else {
    list = [oneOrMany];
  }
  return list;
};
