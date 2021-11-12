const Responder = require("../responder");
const Formatter = require("../formatter");
const Cache = require("./cache");
const { codeBlock } = require("../../../util/format");
const { VERSION } = require("../../constants");

const cache = Cache.getWatchCache();

module.exports = {
  status: function status({ message, oldMessage }) {
    const { author } = message;
    let content = "";

    const authorDatePayload = cache.dates();
    for (const authorId of Object.keys(authorDatePayload)) {
      const payload = authorDatePayload[authorId];
      const dates = Object.keys(payload);

      let authorName = "";
      const dateList = [];
      if (dates.length > 0) {
        for (const date of dates) {
          dateList.push(date);
          if (!authorName) {
            const data = payload[date];
            authorName = data.author.username;
          }
        }

        content += `For author: ${authorName}\n`;
        content += `Dates: ${dateList.join(" ")}\n`;
      }
    }

    return Responder.respond({
      oldMessage,
      message,
      post: Formatter.respond(
        author,
        codeBlock(
          `
Bot Status

Version: ${VERSION}
===================
${content}
      `.trim()
        )
      ),
    });
  },
};
