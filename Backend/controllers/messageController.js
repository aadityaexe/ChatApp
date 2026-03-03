// get all users except the logged in user
import cloudinary from "../Lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Group from "../models/Group.js";
import { io, userSocketMap } from "../server.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch user and populate friends
    const currentUser = await User.findById(userId).populate("friends", "-password");
    let filteredUsers = currentUser.friends || [];

    // Also fetch groups the user belongs to
    const groups = await Group.find({ members: userId }).populate("members", "-password");

    //  count unseen messages for each user (1-on-1)
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      groups: groups,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get all massages for selected user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedId } = req.params; // Can be a userId or groupId
    const myId = req.user._id;

    // Check if it's a group
    const isGroup = await Group.findById(selectedId);
    
    let messages;
    
    if (isGroup) {
      messages = await Message.find({ groupId: selectedId }).sort({ createdAt: 1 }).populate("senderId", "fullName profilePic");
    } else {
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: selectedId },
          { senderId: selectedId, receiverId: myId },
        ],
      }).sort({ createdAt: 1 });

      await Message.updateMany(
        {
          senderId: selectedId,
          receiverId: myId,
          seen: false,
        },
        {
          $set: { seen: true },
        }
      );

      // Notify the sender that we read their messages
      const targetSocketId = userSocketMap[selectedId];
      if (targetSocketId) {
        io.to(targetSocketId).emit("messagesSeen", { byUserId: myId });
      }
    }

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

//  api to mark massages as seen using the message id

export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({
      success: true,
      message: "Message marked as seen",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//  send message to the selected user

export const sendMessage = async (req, res) => {
  try {
    const { text, image, isGroup } = req.body;
    const targetId = req.params.id; // Either receiverId or groupId
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let newMessage;
    
    if (isGroup) {
      newMessage = await Message.create({
        senderId,
        groupId: targetId,
        text,
        image: imageUrl || "",
      });
      
      const populatedMsg = await Message.findById(newMessage._id).populate("senderId", "fullName profilePic");
      const group = await Group.findById(targetId);
      
      if (group) {
        group.members.forEach((memberId) => {
          // Don't emit to self (handled by React state usually, but socket can emit to everyone)
          if (memberId.toString() !== senderId.toString()) {
            const socketId = userSocketMap[memberId.toString()];
            if (socketId) {
              io.to(socketId).emit("newGroupMessage", populatedMsg);
            }
          }
        });
        group.lastMessage = newMessage._id;
        await group.save();
      }
      
      return res.json({ success: true, message: populatedMsg });
      
    } else {
      newMessage = await Message.create({
        senderId,
        receiverId: targetId,
        text,
        image: imageUrl || "",
      });
      
      const receiverSocketId = userSocketMap[targetId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
      res.json({ success: true, message: newMessage });
    }
    
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// delete message

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);

    if (!message) {
      return res.json({ success: false, message: "Message not found" });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized to delete this message" });
    }

    const receiverId = message.receiverId;
    const groupId = message.groupId;

    await Message.findByIdAndDelete(id);

    if (groupId) {
       const group = await Group.findById(groupId);
       if(group) {
          group.members.forEach((memberId) => {
            if (memberId.toString() !== userId.toString()) {
              const socketId = userSocketMap[memberId.toString()];
              if (socketId) {
                io.to(socketId).emit("messageDeleted", { messageId: id });
              }
            }
          });
       }
    } else if (receiverId) {
       const receiverSocketId = userSocketMap[receiverId];
       if (receiverSocketId) {
         io.to(receiverSocketId).emit("messageDeleted", { messageId: id });
       }
    }

    res.json({ success: true, message: "Message deleted successfully", deletedId: id });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
