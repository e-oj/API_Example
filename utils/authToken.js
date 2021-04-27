/**
 * @author EmmanuelOlaojo
 * @since 1/3/17
 */


import jsonWebToken from "jsonwebtoken";
import Promise from "bluebird"

import {getConfig} from "../config/index.js";
import * as  response from "./response.js";

import {HTTP_STATS} from "./HttpStats.js";
import {User} from "../app/user/models/User.js";

let moduleId = "utils/authToken";
const jwt = Promise.promisifyAll(jsonWebToken);
const config = getConfig();

/**
 * Checks that a user has a valid token
 * i.e. is logged in
 *
 * @param req request
 * @param res response
 * @param next next middleware
 *
 * @returns {Promise.<*>}
 */
export const checkToken = async (req, res, next) => {
  let respondErr = response.failure(res, moduleId);
  let authToken = req.get(config.AUTH_TOKEN);
  let fail = () => respondErr(HTTP_STATS.UNAUTHORIZED, config.AUTH_ERR_MSG);

  if(!authToken) return fail();

  try {
    let user = await jwt.verifyAsync(authToken, config.JWT_SECRET);
    user = await User.findById(user._id);

    if(!user) return fail();

    req.user = user;

    next();
  }
  catch(err){
    respondErr(HTTP_STATS.UNAUTHORIZED, config.AUTH_ERR_MSG, err);
  }
};

/**
 * Route handler for retrieving a logged in
 * user.
 *
 * @param req request
 * @param res response
 * @param next callback
 *
 * @return {Promise<*>}
 */
export const findUser = async (req, res, next) => {
  let authToken = req.get(config.AUTH_TOKEN);

  if (!authToken) return next();

  try {
    let user = await jwt.verifyAsync(authToken, config.JWT_SECRET);
    user = await User.findById(user._id);

    if(!user) return next();

    req.user = user;

    next();
  }
  catch(err){
    next();
  }
};

/**
 * Checks if the logged in user is an admin.
 *
 * @param req request
 * @param res response
 * @param next callback
 *
 * @return {*}
 */
export const checkAdmin = (req, res, next) => {
  let respondErr = response.failure(res, moduleId);
  let user = req.user;

  if(!user.admin){
    return respondErr(HTTP_STATS.UNAUTHORIZED, config.AUTH_ERR_MSG);
  }

  next();
};

/**
 * Creates a token from a users's details
 *
 * @param user - the user
 *
 * @returns {Promise.<*>}
 */
export const createToken = async (user) => {
  let {_id, firstName, lastName, email} = user;

  return await jwt.signAsync({_id, firstName, lastName, email}, config.JWT_SECRET, {expiresIn: "168h"});
};
