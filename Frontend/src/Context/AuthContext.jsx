import { createContext, useState } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
