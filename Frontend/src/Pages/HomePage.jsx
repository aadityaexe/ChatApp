import React, { useContext } from "react";
import Sidebar from "../Component/Sidebar";
import ChatContainer from "../Component/ChatContainer";
import RightSidebar from "../Component/RightSidebar";
import CallScreen from "../Component/CallScreen";
import { ChatContext } from "../Context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden sm:px-8 sm:py-8 h-screen">
      {/* Decorative Light Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/50 rounded-bl-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100/50 rounded-tr-full blur-[80px] pointer-events-none"></div>

      <div
        className={`w-full max-w-7xl h-full bg-white border border-gray-200 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden grid grid-cols-1 relative z-10 ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_2fr]"
        } `}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
      <CallScreen />
    </div>
  );
};

export default HomePage;
