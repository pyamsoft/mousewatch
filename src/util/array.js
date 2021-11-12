function asArray(symbolOrSymbols) {
  let symbols;
  if (Array.isArray(symbolOrSymbols)) {
    symbols = symbolOrSymbols;
  } else {
    symbols = [symbolOrSymbols];
  }
  return symbols;
}

module.exports = {
  asArray,
};
