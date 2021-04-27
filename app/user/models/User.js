/**
 * @author emmanuelolaojo
 * @since 2020-03-28
 */

import mongoose from "mongoose";
import {validateUser} from "../validate.js";

const REQUIRED = "{PATH} is required";
const RequiredString = {type: String, required: REQUIRED};

const userSchema = mongoose.Schema({
  firstName: RequiredString,
  lastName: RequiredString,
  email: {...RequiredString, unique: true},
  fb: {type: String, unique: true},
  google: {type: String, unique: true},
  discord: {type: String, unique: true},
  twitch: {type: String, unique: true},
  psnId: {type: String, unique: true},
  xBoxTag: {type: String, unique: true},
  balance: {type: Number, default: 0}
});

userSchema.pre("save", function(next){
  console.log("this: ", this);
  const result = validateUser(this);

  if (!result.validUser){
    const faultyProps = result.errors.join(", ");
    const errMsg = `The following properties are missing or invalid: ${faultyProps}`;

    next(new Error(errMsg));
  }

  else next();
});

export const User = mongoose.model("User", userSchema);