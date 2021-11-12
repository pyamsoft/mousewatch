const { Client } = require("./client");

function newTimer(client) {
  return {
    setInterval: function setInterval(callback, timeout) {
      return client.setInterval(callback, timeout);
    },

    clearInterval: function clearInterval(interval) {
      return client.clearInterval(interval);
    },
  };
}

const Timers = newTimer(Client);

module.exports = {
  Timers,
};
