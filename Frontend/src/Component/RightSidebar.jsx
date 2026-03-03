import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, isGroupChat, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`overflow-y-auto bg-gray-50/50 text-gray-800 w-full h-full relative border-l border-gray-200 flex flex-col custom-scrollbar ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        {/* Profile Header section */}
        <div className="pt-12 pb-6 px-6 flex flex-col items-center gap-4 text-sm font-light mx-auto w-full bg-white border-b border-gray-200">
          <div className="relative">
            {isGroupChat ? (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex justify-center items-center text-4xl font-bold ring-4 ring-white border border-blue-200 overflow-hidden text-blue-700 transition-transform hover:scale-105 duration-300 shadow-sm">
                 {selectedUser.groupImage ? <img src={selectedUser.groupImage} className="w-full h-full object-cover"/> : selectedUser.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <>
                <img
                  className="w-24 h-24 rounded-full ring-4 ring-white border border-gray-200 shadow-sm object-cover transition-transform hover:scale-105 duration-300"
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt="Profile Profile"
                />
                {!isGroupChat && onlineUsers.includes(selectedUser._id) && (
                  <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 shadow-sm border-2 border-white"></div>
                )}
              </>
            )}
          </div>
          
          <div className="flex flex-col items-center select-text text-center">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              {isGroupChat ? selectedUser.name : selectedUser.fullName}
            </h1>
            {!isGroupChat && (
              <div className="flex items-center gap-1.5 mt-1.5 mb-1 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id) ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className={`text-xs font-semibold ${onlineUsers.includes(selectedUser._id) ? 'text-green-600' : 'text-gray-500'}`}>
                  {onlineUsers.includes(selectedUser._id) ? 'Active Now' : 'Offline'}
                </span>
              </div>
            )}
            <p className="text-gray-500 font-medium text-sm mt-1 max-w-xs">
               {isGroupChat 
                 ? `${selectedUser.members.length} participants` 
                 : (selectedUser.bio || "No bio available")}
            </p>
          </div>
        </div>

        {/* Members List (Group Only) */}
        {isGroupChat && (
          <div className="px-6 mt-6">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Group Members</p>
            <div className="max-h-[180px] overflow-y-auto space-y-2 custom-scrollbar pr-1">
              {selectedUser.members.map(member => (
                <div key={member._id} className="flex items-center gap-3 bg-white hover:bg-gray-50 p-2.5 rounded-xl border border-gray-200 transition-colors shadow-sm">
                  <div className="relative">
                     <img src={member.profilePic || assets.avatar_icon} className="w-8 h-8 rounded-full object-cover" />
                     {onlineUsers.includes(member._id) && (
                       <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                     )}
                  </div>
                  <p className="text-gray-800 text-sm font-medium truncate flex-1">{member.fullName}</p>
                  {member._id === selectedUser.admin && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-200">Admin</span>
                  )}
                </div>
              ))}
            </div>
            <hr className="my-6 border-gray-200" />
          </div>
        )}

        {!isGroupChat && <div className="mt-6"></div>}

        {/* Media Gallery */}
        <div className="px-6 flex-1 flex flex-col pb-24">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Shared Media</p>
          {msgImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="cursor-pointer rounded-xl overflow-hidden border border-gray-200 aspect-square group relative shadow-sm"
                >
                  <img src={url} alt="Media" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-32 opacity-40 text-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">No media shared in this conversation yet</p>
             </div>
          )}
        </div>

        {/* Global Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
          <button
            onClick={logout}
            className="w-full py-3 bg-white hover:bg-gray-50 text-red-600 font-semibold border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 flex justify-center items-center gap-2 transform active:scale-95 shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
        
      </div>
    )
  );
};

export default RightSidebar;
