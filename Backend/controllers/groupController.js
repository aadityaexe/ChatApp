import Group from "../models/Group.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, members, groupImage } = req.body;
    const adminId = req.user._id;

    if (!name || !members || members.length === 0) {
      return res.json({ success: false, message: "Please provide a name and at least one member" });
    }

    const allMembers = [...members, adminId.toString()];

    const newGroup = await Group.create({
      name,
      members: allMembers,
      admin: adminId,
      groupImage,
    });

    const populatedGroup = await Group.findById(newGroup._id).populate("members", "-password");

    // Emit group creation event to all members
    allMembers.forEach((memberId) => {
      const socketId = userSocketMap[memberId];
      if (socketId) {
        io.to(socketId).emit("newGroupCreated", populatedGroup);
      }
    });

    res.json({ success: true, group: populatedGroup, message: "Group created successfully" });
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Add members to group
export const addMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { members } = req.body;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) return res.json({ success: false, message: "Group not found" });
    if (group.admin.toString() !== adminId.toString()) {
      return res.json({ success: false, message: "Only admin can add members" });
    }

    members.forEach((member) => {
      if (!group.members.includes(member)) {
        group.members.push(member);
      }
    });

    await group.save();

    const populatedGroup = await Group.findById(groupId).populate("members", "-password");

    // Emit event
    populatedGroup.members.forEach((member) => {
      const socketId = userSocketMap[member._id.toString()];
      if (socketId) {
        io.to(socketId).emit("groupUpdated", populatedGroup);
      }
    });

    res.json({ success: true, group: populatedGroup });
  } catch (error) {
    console.error("Error adding members:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Remove member or leave group
export const removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const currentUserId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) return res.json({ success: false, message: "Group not found" });

    // Ensure it's the admin removing OR the user is leaving themselves
    if (group.admin.toString() !== currentUserId.toString() && memberId !== currentUserId.toString()) {
      return res.json({ success: false, message: "Not authorized" });
    }

    group.members = group.members.filter((id) => id.toString() !== memberId);

    await group.save();

    const populatedGroup = await Group.findById(groupId).populate("members", "-password");

    // Notify removed member
    const removedSocketId = userSocketMap[memberId];
    if (removedSocketId) {
      io.to(removedSocketId).emit("removedFromGroup", groupId);
    }

    // Notify remaining members
    populatedGroup.members.forEach((member) => {
      const socketId = userSocketMap[member._id.toString()];
      if (socketId) {
        io.to(socketId).emit("groupUpdated", populatedGroup);
      }
    });

    res.json({ success: true, group: populatedGroup });
  } catch (error) {
    console.error("Error removing member:", error.message);
    res.json({ success: false, message: error.message });
  }
};
