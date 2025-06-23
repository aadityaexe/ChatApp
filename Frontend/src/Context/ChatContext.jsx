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

  const value = {};
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
