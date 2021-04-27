/**
 * @author emmanuelolaojo
 * @since 2021-01-06
 */

import validator from "validator";

export const userProps = new Set(["firstName", "lastName", "email"]);
export const socialProps = new Set(["fb", "google", "discord", "twitch"]);
export const gamerProps = new Set(["psnId", "xBoxTag"]);

/**
 * Checks that a user object is valid.
 *
 * @param user - user obj
 * @return {{validUser: boolean, errors: Array}}
 */
export const validateUser = (user) => {
  console.log("Validating user: ", user);
  const props = [...userProps, ...gamerProps, ...socialProps];
  let foundGamerTag = false;
  let foundSocial = false;
  let hasUserProps = true;
  let errors = [];

  for (let prop of props) {
    if (userProps.has(prop) && !validValue(user, prop) ) {
      hasUserProps = false;
      errors.push(prop);
    }

    if (socialProps.has(prop) && validValue(user, prop)){
      foundSocial = true;
    }

    if (gamerProps.has(prop) && validValue(user, prop)){
      foundGamerTag = true;
    }
  }

  if (!foundGamerTag) {
    errors.push("psnId/xboxTag");
  }

  if (!foundSocial) {
    errors.push("social");
  }

  let validUser = hasUserProps && foundSocial && foundGamerTag;

  return {validUser, errors};
};

const validValue = (user, prop) => {
  if (prop === "email") {
    return validator.isEmail(user[prop]);
  }

  return user[prop] && user[prop].length > 1;
};
