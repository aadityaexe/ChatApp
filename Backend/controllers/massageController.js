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

// get all massages for selected user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.user._id;
    const myId = req.user._id;

    // find all messages between the logged in user and the selected user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // mark all messages as seen
    await Message.updateMany({
      senderId: selectedUserId,
      receiverId: myId,
      seen: true,
    });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
