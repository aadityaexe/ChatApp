import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // This stores friends
  const [groups, setGroups] = useState([]); // This stores groups
  const [selectedUser, setSelectedUser] = useState(null); // Can be a user or a group
  const [isGroupChat, setIsGroupChat] = useState(false); // Flag for group chat
  const [unseenMessages, setUnseenMessages] = useState([]);
  
  // Friend System states
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const { socket, axios } = useContext(AuthContext);

  // function to get all users for sidebar

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.users);
        setGroups(data.groups || []);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getFriendRequests = async () => {
    try {
      const { data } = await axios.get("/api/auth/friends");
      if (data.success) {
        setFriendRequests(data.friendRequests || []);
        setUsers(data.friends || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchGlobalUsers = async (query) => {
    try {
      if(!query) return setSearchResults([]);
      const { data } = await axios.get(`/api/auth/search?search=${query}`);
      if (data.success) {
        setSearchResults(data.users);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendFriendRequest = async (targetUserId) => {
    try {
      const { data } = await axios.post("/api/auth/friend-request", { targetUserId });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const respondToRequest = async (targetUserId, action) => {
    try {
      const { data } = await axios.post(`/api/auth/friend-request/${action}`, { targetUserId });
      if (data.success) {
        toast.success(data.message);
        setFriendRequests(friendRequests.filter(req => req._id !== targetUserId));
        if(action === 'accept') {
          getUsers(); // Refresh friends list
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Group functions
  const createGroup = async (groupData) => {
    try {
      const { data } = await axios.post("/api/groups/create", groupData);
      if (data.success) {
        toast.success(data.message);
        setGroups([...groups, data.group]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to get messages for selected user

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to send messages for selected user

  const sendMessage = async (messageData) => {
    try {
      const targetId = selectedUser._id;
      const { data } = await axios.post(
        `/api/messages/send/${targetId}`,
        { ...messageData, isGroup: isGroupChat }
      );

      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to subscribe to messages for selected user

  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessages) => {
      if (!isGroupChat && selectedUser && newMessages.senderId === selectedUser._id) {
        newMessages.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessages]);
        axios.put(`/api/messages/mark/${newMessages._id}`, { seen: true });
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessages.senderId]: prevUnseenMessages[newMessages.senderId]
            ? prevUnseenMessages[newMessages.senderId] + 1
            : 1,
        }));
      }
    });

    socket.on("newGroupMessage", (newMsg) => {
      if (isGroupChat && selectedUser && newMsg.groupId === selectedUser._id) {
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      } else {
         setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMsg.groupId]: prevUnseenMessages[newMsg.groupId]
            ? prevUnseenMessages[newMsg.groupId] + 1
            : 1,
        }));
      }
    });

    // Friend request listeners
    socket.on("receiveFriendRequest", ({ from }) => {
      toast.success(`${from.fullName} sent you a friend request!`);
      setFriendRequests((prev) => [...prev, from]);
    });

    socket.on("friendRequestAccepted", ({ by }) => {
      toast.success(`${by.fullName} accepted your friend request!`);
      getUsers();
    });

    // Group listeners
    socket.on("newGroupCreated", (group) => {
      setGroups((prev) => [...prev, group]);
    });
    
    socket.on("groupUpdated", (group) => {
      setGroups((prev) => prev.map(g => g._id === group._id ? group : g));
      if(selectedUser && selectedUser._id === group._id) {
        setSelectedUser(group);
      }
    });
    
    socket.on("removedFromGroup", (groupId) => {
      setGroups((prev) => prev.filter(g => g._id !== groupId));
      if(selectedUser && selectedUser._id === groupId) {
        setSelectedUser(null);
        setIsGroupChat(false);
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) {
      socket.off("newMessage");
      socket.off("newGroupMessage");
      socket.off("receiveFriendRequest");
      socket.off("friendRequestAccepted");
      socket.off("newGroupCreated");
      socket.off("groupUpdated");
      socket.off("removedFromGroup");
    }
  };
  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser, isGroupChat]);

  useEffect(() => {
    if(socket) {
      getFriendRequests();
    }
  }, [socket]);

  const value = {
    messages,
    users,
    groups,
    selectedUser,
    isGroupChat,
    friendRequests,
    searchResults,
    getUsers,
    getFriendRequests,
    setMessages,
    sendMessage,
    setSelectedUser,
    setIsGroupChat,
    unseenMessages,
    setUnseenMessages,
    getMessages,
    searchGlobalUsers,
    sendFriendRequest,
    respondToRequest,
    createGroup,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
