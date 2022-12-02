function newTimer() {
  return {
    setInterval: function (callback, timeout) {
      return setInterval(callback, timeout);
    },

    clearInterval: function (interval) {
      return clearInterval(interval);
    },
  };
}

const Timers = newTimer();

module.exports = {
  Timers,
};
