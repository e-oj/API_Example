/**
 * @author emmanuelolaojo
 * @since 12/25/18
 */

import express from "express";

import {router as userRouter} from "./user/index.js";

export const api = express.Router();

api.use("/user", userRouter);

api.use("*", (req, res) => res.send("yo"));
