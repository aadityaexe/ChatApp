import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  changePassword
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.put("/change-password", protectRoute, changePassword);
userRouter.get("/check", protectRoute, checkAuth);

// Friend System Routes
userRouter.get("/search", protectRoute, searchUsers);
userRouter.get("/friends", protectRoute, getFriends);
userRouter.post("/friend-request", protectRoute, sendFriendRequest);
userRouter.post("/friend-request/accept", protectRoute, acceptFriendRequest);
userRouter.post("/friend-request/reject", protectRoute, rejectFriendRequest);
userRouter.post("/friend/remove", protectRoute, removeFriend);

export default userRouter;
