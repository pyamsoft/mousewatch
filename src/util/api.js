const axios = require("axios");

// The Disney API blocks us unless we spoof our user agent to Firefox
const spoofUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0";

module.exports = {
  disneyApi: function disneyApi(url) {
    return axios({
      method: "GET",
      url,
      headers: { "User-Agent": spoofUserAgent },
    }).then(r => r.data);
  },
};
