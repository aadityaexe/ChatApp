import express from "express";
import { protectRoute } from "../middleware/Auth.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessagesAsSeen,
  sendMessage,
} from "../controllers/massageController.js";

const massageRouter = express.Router();

massageRouter.get("/users", protectRoute, getUsersForSidebar);
massageRouter.get("/:id", protectRoute, getMessages);
massageRouter.put("mark/:id", protectRoute, markMessagesAsSeen);

massageRouter.post("/send/:id", protectRoute, sendMessage);

export default massageRouter;
