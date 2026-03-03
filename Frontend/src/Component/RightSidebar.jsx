import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, isGroupChat, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  //  get all the images from messages

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`overflow-y-scroll bg-[#818582]/60 text-black text-2xl w-full relative ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-sm font-light mx-auto">
          {isGroupChat ? (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex justify-center items-center text-3xl font-bold shadow-inner ring-4 ring-gray-800 overflow-hidden text-white">
               {selectedUser.groupImage ? <img src={selectedUser.groupImage} className="w-full h-full object-cover"/> : selectedUser.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img
              className=" w-20 aspect-[1/1] rounded-full ring-4 ring-gray-800 object-cover"
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt=""
            />
          )}
          <h1 className="gap-2 px-10 text-xl font-medium mx-auto flex items-center text-white mt-2">
            {!isGroupChat && onlineUsers.includes(selectedUser._id) && (
              <p className=" w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></p>
            )}
            {isGroupChat ? selectedUser.name : selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto text-gray-400 text-center max-w-xs">{isGroupChat ? `${selectedUser.members.length} participants` : selectedUser.bio}</p>
        </div>

        {isGroupChat && (
          <div className="px-5 mt-6 text-sm">
            <p className="text-gray-400 font-medium mb-3">Members</p>
            <div className="max-h-[150px] overflow-y-auto space-y-2 custom-scrollbar">
              {selectedUser.members.map(member => (
                <div key={member._id} className="flex items-center gap-2 bg-gray-800/50 p-2 rounded-lg">
                  <img src={member.profilePic || assets.avatar_icon} className="w-6 h-6 rounded-full" />
                  <p className="text-gray-300 text-xs truncate flex-1">{member.fullName}</p>
                  {member._id === selectedUser.admin && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">Admin</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        <hr className="my-4 border-[#ffffff50]" />
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={logout}
          className="absolute
bottom-5
left-1/2
transform
-translate-x-1/2
bg-gradient-to-r from-gray-400 to-gray-600
text-white
border-none
text-sm
font-light
py-2
px-20
rounded-full
cursor-pointer
"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
