/**
 * @author EmmanuelOlaojo
 * @since 12/20/17
 */

import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import https from "https";

import {getConfig} from "./config/index.js";
import {api} from "./app/api.js";

const config = getConfig();

mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(config.DB_URL, config.DB_OPTIONS);

let app = express();

app.disable('etag');
app.use(helmet());

app.use(compression({level: 6})); // Default compression level is 6

app.use(logger("dev"));
app.use(bodyParser.json({limit: config.MAX_PAYLOAD}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use("/api", api);

app.use("*", (req, res) => {
  res.send(`invalid request!, ${req.path}`);
});

// start https or HTTP_STATS server
startServer();

/**
 * Starts a development or production
 * server with HTTP_STATS or https.
 */
function startServer(){
  const {PORT} = config;
  let server;

  if(process.env["NODE_ENV"] === "production"){
    server = prodServer(PORT);
  }
  else {
    server = devServer(PORT);
  }

  server.on("close", async err => {
    if(err) throw err;

    console.log("\nClosing db connections...\n");
    try{
      await mongoose.disconnect();
    }
    catch (e) {
      console.error(e.message)
    }
    console.log("Server Out!! *drops mic*");
  });

  process.on("SIGINT", () => server.close());

  console.log(`Running on port: ${PORT}`);
}

/**
 * Starts an https server at
 * the given port
 *
 * @param port - port number
 * @return {Server}
 */
function prodServer(port){
  let options = {
    key: config.KEY,
    cert: config.CERT
  };

  return https.createServer(options, app).listen(port)
}

/**
 * Starts an HTTP_STATS or, if the env vars
 * are present, https server at the
 * given port.
 *
 * @param port - port number
 * @return {*}
 */
function devServer(port){
  if(config.CERT && config.KEY){
    return prodServer(port);
  }

  return app.listen(port);
}