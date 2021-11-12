const Show = require("./show");
const Watch = require("./watch");
const Cancel = require("./cancel");
const Status = require("./status");

module.exports = {
  show: function show({ oldMessage, message, content }) {
    return Show.show({ oldMessage, message, content });
  },

  watch: function watch({ oldMessage, message, content }) {
    return Watch.watch({ message, oldMessage, content });
  },

  cancel: function cancel({ oldMessage, message, content }) {
    return Cancel.cancel({ oldMessage, message, content });
  },

  status: function status({ oldMessage, message }) {
    return Status.status({ message, oldMessage });
  },
};
