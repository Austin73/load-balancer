const https = require("https");
const fs = require("fs");
const router = require("./routes/proxy");
const express = require("express");

const optios = {
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
};

const app = express();

https.createServer(optios, app).listen(443, () => {
  console.log("load balancer started on port 443");
});

app.use("/app", router);
