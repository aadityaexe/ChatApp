import cloudinary from "../Lib/cloudinary.js";
import { generateToken } from "../Lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { io, userSocketMap } from "../server.js";
// Singup a new user
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!email || !fullName || !password || !bio) {
      return res.json({
        success: false,
        message: "missing details",
      });
    }
    
    const formattedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: formattedEmail });
    if (user) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullName,
      email: formattedEmail,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Login a user

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const formattedEmail = email.toLowerCase().trim();
    const userData = await User.findOne({ email: formattedEmail });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(userData._id);

    res.json({
      success: true,
      userData,
      token,
      message: "Login successfully",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//  controller to check if user i authenticated

export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// controller to update user profile details

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    const userId = req.user._id;

    let updateUser;

    if (!profilePic) {
      updateUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
        },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
          profilePic: upload.secure_url,
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      user: updateUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Search users globally
export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { fullName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === targetUserId) {
      return res.json({ success: false, message: "You cannot add yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if already friends or request already sent
    if (targetUser.friends.includes(currentUserId)) {
      return res.json({ success: false, message: "You are already friends" });
    }
    if (targetUser.friendRequests.includes(currentUserId)) {
      return res.json({ success: false, message: "Friend request already sent" });
    }

    targetUser.friendRequests.push(currentUserId);
    await targetUser.save();

    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("receiveFriendRequest", {
        from: {
          _id: currentUser._id,
          fullName: currentUser.fullName,
          profilePic: currentUser.profilePic
        }
      });
    }

    res.json({ success: true, message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser.friendRequests.includes(targetUserId)) {
      return res.json({ success: false, message: "No friend request found" });
    }

    // Remove from requests, add to friends
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== targetUserId
    );
    currentUser.friends.push(targetUserId);

    targetUser.friends.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("friendRequestAccepted", {
        by: {
          _id: currentUser._id,
          fullName: currentUser.fullName,
          profilePic: currentUser.profilePic
        }
      });
    }

    res.json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Reject Friend Request
export const rejectFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== targetUserId
    );

    await currentUser.save();

    res.json({ success: true, message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Remove Friend
export const removeFriend = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.friends = targetUser.friends.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ success: true, message: "Friend removed" });
  } catch (error) {
    console.error("Error removing friend:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all friends
export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "-password").populate("friendRequests", "-password");
    res.json({ 
      success: true, 
      friends: user.friends,
      friendRequests: user.friendRequests
    });
  } catch (error) {
    console.error("Error getting friends:", error.message);
    res.json({ success: false, message: error.message });
  }
};
