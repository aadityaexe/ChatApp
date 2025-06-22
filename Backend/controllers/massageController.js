// get all users except the logged in user

import Message from "../models/Massage.js";
import User from "../models/User.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const usersId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: usersId } }).select(
      "-password"
    );

    //  count unseen messages for each user
    const unseenMessages = {};

    constpromises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: usersId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[User._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.Message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
