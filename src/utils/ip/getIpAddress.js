const { networkInterfaces } = require('os');

module.exports = function getIP() {
  const nets = networkInterfaces();
  const results = {};
  let ip = '';

  // get ipv4 non internal address only
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results[name] = net.address;
      }
    }
  }

  // if multiple ip are available; maybe through both ethernet and wifi
  for (const name of Object.keys(results)) {
    let ipTemp = results[name];
    if (ipTemp !== ip) {
      ip = ipTemp;
    }
  }

  return ip;
};
