import { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets.js";
import { formatMassageDate } from "../lib/utils";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";
import { CallContext } from "../Context/CallContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { selectedUser, isGroupChat, setSelectedUser, messages, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const { callUser } = useContext(CallContext);
  const scrollEnd = useRef(null);

  const [input, setInput] = useState("");

  //Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  //Handle sending a image

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
    }
    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return selectedUser ? (
    <div className="w-full overflow-scroll relative bg-[#818582]/40 backdrop-blur-lg">
      {/* header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <div className="relative">
          {isGroupChat ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex justify-center items-center text-lg font-bold shadow-inner ring-2 ring-gray-700 overflow-hidden text-white">
               {selectedUser.groupImage ? <img src={selectedUser.groupImage} className="w-full h-full object-cover"/> : selectedUser.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt=""
              className="w-10 h-10 object-cover rounded-full ring-2 ring-gray-700"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
           <p className="text-lg text-white flex items-center gap-2 font-medium truncate">
            {isGroupChat ? selectedUser.name : selectedUser.fullName}
            {!isGroupChat && onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500 mt-1"></span>
            )}
           </p>
           {isGroupChat && <p className="text-xs text-gray-400">{selectedUser.members.length} members</p>}
        </div>

        {/* Video Call Button (Only for 1-on-1 for now) */}
        {!isGroupChat && (
          <button 
            onClick={() => callUser(selectedUser._id)}
            className="p-2 bg-indigo-500/20 text-indigo-400 rounded-full hover:bg-indigo-500 hover:text-white transition"
            title="Video Call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </button>
        )}
        <img
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
          onClick={() => setSelectedUser(null)}
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>
      {/* chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <div className="flex flex-col mb-8">
                 {isGroupChat && msg.senderId !== authUser._id && (
                    <p className="text-[10px] text-gray-400 ml-1 mb-1">{msg.senderId?.fullName || "User"}</p>
                 )}
                 <img
                  src={msg.image}
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                 />
              </div>
            ) : (
              <div className="flex flex-col mb-8">
                {isGroupChat && msg.senderId !== authUser._id && (
                    <p className="text-[10px] text-gray-400 ml-1 mb-1">{msg.senderId?.fullName || "User"}</p>
                 )}
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all ${
                    msg.senderId === authUser._id
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            )}

            <div className=" text-center text-xs pb-8 pl-1">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : (msg.senderId?.profilePic || assets.avatar_icon)
                }
                alt=""
                className=" w-7 h-7 object-cover rounded-full ring-1 ring-gray-600"
              />
              <p className="text-gray-500 text-[9px] mt-1">
                {formatMassageDate(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/* bottem area */}
      <div className="absolute flex bottom-0 left-0 right-0 items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3  rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => {
              e.key === "Enter" ? handleSendMessage(e) : null;
            }}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png , image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-wite">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
