import axios from "axios";

const fireHealthCheck = function (url: string) {
  axios({
    method: "GET",
    url,
  })
    .then(() => {
      // Ignore
    })
    .catch(() => {
      // Ignore
    });
};

export const registerPeriodicHealthCheck = function (url: string) {
  let timer: any = undefined;

  if (url) {
    timer = setInterval(() => {
      fireHealthCheck(url);
    }, 60 * 1000);

    fireHealthCheck(url);
  }

  return {
    unregister: function () {
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    },
  };
};
