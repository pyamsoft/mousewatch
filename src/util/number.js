function safeParseNumber(s) {
  try {
    return parseFloat(s);
  } catch (e) {
    return -1;
  }
}

module.exports = {
  safeParseNumber,
};
