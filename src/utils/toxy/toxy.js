const axios = require('axios').default;

module.exports = (message) => {
  return axios
    .post(
      `${process.env.TOXY_ACCESS_POINT}/predict`,
      {
        message,
      },
      { headers: { token: process.env.TOXY_TOKEN } }
    )
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
