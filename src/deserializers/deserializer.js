const Deserializer = require('./index.js');

function deserialize(body) {
  return new Promise((res, rej) => {
    Deserializer.deserialize(body, (err, data) => {
      if (err) {
        return rej(err);
      }
      return res(data);
    });
  });
}

module.exports = {
  deserialize,
};
