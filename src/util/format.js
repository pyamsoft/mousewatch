function code(message) {
  return `\`${message}\``;
}

function codeBlock(message) {
  return `\`\`\`${message}\`\`\``;
}

function bold(message) {
  return `**${message}**`;
}

function italic(message) {
  return `*${message}*`;
}

module.exports = {
  code,
  codeBlock,
  bold,
  italic,
};
