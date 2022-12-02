function newStatus(client) {
  return {
    setActivity: function setActivity(message) {
      return client.user.setActivity(message);
    },
  };
}

module.exports = {
  create: newStatus,
};
