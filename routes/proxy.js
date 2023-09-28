const express = require("express");
const proxy = require("http-proxy-middleware");
const router = express.Router();

const servers = [
  {
    host: "localhost",
    port: 3000,
    weight: 1,
  },
  //  we can add more servers
];

// proxy middleware configurations
const proxyOptions = {
  target: "",
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    // Add custom header to request
    proxyReq.setHeader("X-Special-Proxy-Header", "foobar");
  },
  logLevel: "debug",
};

//  server index
let currIndex = 0;

// Get Next server
function getServer() {
  // Round Robin
  currIndex = (currIndex + 1) % servers.length;
  return servers[currIndex];
}

// Proxy requests
router.all("*", (req, res) => {
  // Get next server
  const target = getServer();
  proxyOptions.target = `https://${target.host}:${target.port}`;

  //   forward request
  proxy(proxyOptions)(req, res);
});

module.exports = router;
