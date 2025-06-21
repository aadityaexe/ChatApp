import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controllers/userController";
import { protectRoute } from "../middleware/Auth";

const userRouter = express.Router();

userRouter.post("/signuo", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check-auth", protectRoute, checkAuth);

export default userRouter;
