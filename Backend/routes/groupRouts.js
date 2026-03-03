import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createGroup, addMembers, removeMember } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", protectRoute, createGroup);
groupRouter.put("/:groupId/add", protectRoute, addMembers);
groupRouter.put("/:groupId/remove", protectRoute, removeMember);

export default groupRouter;
