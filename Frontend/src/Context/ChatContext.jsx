import { useContext } from "react";
import { createContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [unseenMessages, setUnseenMessages] = useState([]);

  const { socket, axios } = useContext(AuthContext);

  // function to get all users for sidebar

  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUser(data.user);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.messages);
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
      toast.error(error.messages);
    }
  };

  // function to send messages for selected user

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.get(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessages]);
      } else {
        toast.error(data.messages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };

  // function to subscribe to messages for selected user

  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessages) => {
      if (selectedUser && newMessages.senderId === selectedUser._id) {
        newMessages.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessages]);
        axios.put(`/api/messages/mark/${newMessages._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessages.senderId]: prevUnseenMessages[newMessages.senderId]
            ? prevUnseenMessages[newMessages.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const value = {};
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
