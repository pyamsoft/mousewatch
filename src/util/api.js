const axios = require("axios");

// The Disney API blocks us unless we spoof our user agent to Firefox
const spoofUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0";

const DISNEY_HEADERS = {
  "User-Agent": spoofUserAgent,
};

module.exports = {
  disneyApi: function disneyApi(url) {
    return axios({
      method: "GET",
      url,
      headers: DISNEY_HEADERS,
    }).then((r) => r.data);
  },
};
