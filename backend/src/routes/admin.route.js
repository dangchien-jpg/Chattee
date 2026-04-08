import express from "express";
import { block, getAllUsers } from "../controllers/admin.controller.js";

const route = express.Router();

route.get("/users", getAllUsers);
route.patch("/:userId/block", block);

export default route;
