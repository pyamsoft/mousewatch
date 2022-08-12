export interface Listener {
  stop: () => void;
}

export const newListener = function (stopListening: () => void): Listener {
  return Object.freeze({
    stop: function () {
      stopListening();
    },
  });
};
