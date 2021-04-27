/**
 * @author emmanuelolaojo
 * @since 2020-04-03
 */


const moduleId = "/api/user";

import * as response from "../../utils/response.js";
import * as auth from "../../utils/authToken.js";
import {HTTP_STATS} from "../../utils/HttpStats.js";
import {User} from "./models/User.js";

/**
 * Creates a user based on the request body.
 *
 * @param req request
 * @param res response
 *
 * @return {Promise<void>}
 */
export const createUser = async (req, res) => {
  const respond = response.success(res);
  const respondErr = response.failure(res, moduleId);
  const existingUser = await getExistingUser(req.body.email);
  let user = existingUser || new User();

  for (let prop of Object.keys(req.body)){
    user[prop] = req.body[prop]
  }

  try {
    user = (await user.save()).toObject();
    const token = await auth.createToken(user);

    respond(HTTP_STATS.CREATED, "User Created!", {user, token})
  }
  catch (err) {
    console.error(err.stack);
    const errMessage = err.message ? err.message : "Error Creating User";

    respondErr(HTTP_STATS.SERVER_ERROR, errMessage);
  }
};

/**
 * Finds and existing user by email.
 *
 * @param email user's email
 * @return {Promise<*>}
 */
const getExistingUser = async (email) => {
  if (!email) return null;

  return await User.findOne({email});
};

