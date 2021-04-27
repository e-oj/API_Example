/* eslint-disable no-undef */

/**
 * @author EmmanuelOlaojo
 * @since 11/22/17
 */

import fs from "fs";
import {config} from "./vars.js";

const {SECRET} = process.env;
let configured = false;

export function getConfig() {
  if(configured){
    return config;
  }

  // TLS credentials
  if(config.CERT && config.KEY){
    config.CERT = fs.readFileSync(config.CERT);
    config.KEY = fs.readFileSync(config.KEY);
  }
  else {
    envErr("CERT", "KEY");
  }

// mongodb credentials
  if (config.M_USER && config.M_PASS){
    let opts = config.DB_OPTIONS;

    opts["auth"] = {authdb: DB};
    opts["user"] = config.M_USER;
    opts["pass"] = config.M_PASS;
  }
  else {
    envErr("M_USER", "M_PASS");
  }

// jwt secret
  if (SECRET){
    config.JWT_SECRET = SECRET;
  }
  else{
    envErr("JWT_SECRET");
  }

  configured = true;

  return config;
}

/**
 * Output possible env errors to
 * the console
 */
function envErr(){
  if (process.env.NODE_ENV === "production"){
    let message = "Error: Set env var(s)";

    for(let arg of arguments){
      message += " '" + arg + "'"
    }

    console.error(message);
    process.exit(1);
  }
}
