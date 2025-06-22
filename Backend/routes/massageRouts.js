import express from "express";
import { protectRoute } from "../middleware/Auth";
import {
  getMessages,
  getUsersForSidebar,
  markMessagesAsSeen,
} from "../controllers/massageController";

const massageRouter = express.Router();

massageRouter.get("/user", protectRoute, getUsersForSidebar);
massageRouter.get("/:id", protectRoute, getMessages);
massageRouter.get("mark/:id", protectRoute, markMessagesAsSeen);

export default massageRouter;
