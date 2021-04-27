/**
 * @author emmanuelolaojo
 * @since 2020-03-28
 */

import express from "express";

import {createUser} from "./user.js";

export const router = express.Router();


router.post("/create", createUser);
