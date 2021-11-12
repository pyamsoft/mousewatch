function newEmitter(client) {
  return {
    on: function on(event, callback) {
      return client.on(event, callback);
    },
  };
}

module.exports = {
  create: newEmitter,
};
