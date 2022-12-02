export const code = function (message: string): string {
  return `\`${message}\``;
};

export const codeBlock = function (message: string): string {
  return `\`\`\`${message}\`\`\``;
};

export const bold = function (message: string): string {
  return `**${message}**`;
};

export const italic = function (message: string): string {
  return `*${message}*`;
};
