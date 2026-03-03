import { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets.js";
import { formatMassageDate } from "../lib/utils";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";
import { CallContext } from "../Context/CallContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { selectedUser, isGroupChat, setSelectedUser, messages, sendMessage, getMessages, typingUsers, deleteMessage } =
    useContext(ChatContext);
  const { authUser, onlineUsers, socket } = useContext(AuthContext);
  const { callUser } = useContext(CallContext);
  const scrollEnd = useRef(null);

  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
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
  }, [messages, typingUsers]);

  useEffect(() => {
    if (input && socket && selectedUser && !isGroupChat) {
      socket.emit("typing", { senderId: authUser._id, receiverId: selectedUser._id });
      const timeoutId = setTimeout(() => {
        socket.emit("stopTyping", { senderId: authUser._id, receiverId: selectedUser._id });
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [input, socket, selectedUser, authUser, isGroupChat]);

  return selectedUser ? (
    <div className="w-full h-full flex flex-col relative bg-transparent overflow-hidden border-x border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-4 py-4 px-6 border-b border-gray-200 bg-white/80 backdrop-blur-md shrink-0">
        <div className="relative shrink-0">
          {isGroupChat ? (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex justify-center items-center text-xl font-bold border border-blue-200 overflow-hidden text-blue-700">
               {selectedUser.groupImage ? <img src={selectedUser.groupImage} className="w-full h-full object-cover"/> : selectedUser.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="relative">
               <img
                 src={selectedUser.profilePic || assets.avatar_icon}
                 alt="Profile"
                 className="w-12 h-12 object-cover rounded-full border border-gray-200 shadow-sm"
               />
               {onlineUsers.includes(selectedUser._id) && (
                 <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
               )}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
           <h2 className="text-xl text-gray-800 font-bold tracking-tight truncate">
            {isGroupChat ? selectedUser.name : selectedUser.fullName}
           </h2>
           <p className="text-sm text-blue-600 font-medium truncate">
             {isGroupChat 
               ? `${selectedUser.members.length} members` 
               : (onlineUsers.includes(selectedUser._id) ? "Online now" : "Offline")}
           </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {!isGroupChat && (
            <button 
              onClick={() => callUser(selectedUser._id)}
              className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all duration-200"
              title="Video Call"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </button>
          )}
          <button 
            onClick={() => setSelectedUser(null)}
            className="p-3 md:hidden bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth bg-gray-50/30">
        {messages.map((msg, index) => {
          const isMine = msg.senderId === authUser._id;
          
          return (
          <div
            key={index}
            className={`flex items-end gap-3 ${isMine ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div className="shrink-0 mb-6">
              <img
                src={isMine 
                  ? authUser?.profilePic || assets.avatar_icon 
                  : (msg.senderId?.profilePic || assets.avatar_icon)}
                alt="Avatar"
                className="w-8 h-8 object-cover rounded-full border border-gray-200 shadow-sm"
              />
            </div>

            {/* Message Content */}
            <div className={`flex flex-col max-w-[70%] xl:max-w-[60%] relative group ${isMine ? "items-end" : "items-start"}`}>
              {isMine && (
                 <button 
                    onClick={() => deleteMessage(msg._id)}
                    className="absolute top-1/2 -translate-y-1/2 -left-12 p-2 text-red-500 bg-white shadow-md border border-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hover:bg-red-50 scale-90 hover:scale-100"
                    title="Delete Message"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
              )}
              
              {isGroupChat && !isMine && (
                <span className="text-[11px] font-medium text-gray-500 mb-1 ml-1 px-2 py-0.5 bg-gray-200/50 rounded-full">
                  {msg.senderId?.fullName || "User"}
                </span>
              )}

              {msg.image ? (
                <div className="relative group overflow-hidden rounded-2xl border border-gray-200 shadow-sm mb-1 mt-1">
                  <img src={msg.image} className="max-w-[250px] md:max-w-[300px] hover:scale-[1.02] transition-transform duration-300" />
                </div>
              ) : (
                <div 
                  className={`px-5 py-3 shadow-sm ${
                    isMine
                      ? "bg-blue-600 text-white rounded-[1.5rem] rounded-br-[0.25rem]"
                      : "bg-white text-gray-800 border border-gray-200 rounded-[1.5rem] rounded-bl-[0.25rem]"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                </div>
              )}
              
              {/* Timestamp & Seen Indicator */}
              <div className={`flex items-center gap-1 mt-1 ${isMine ? "mr-2" : "ml-2"}`}>
                <span className="text-[10px] text-gray-400">
                  {formatMassageDate(msg.createdAt)}
                </span>
                {isMine && !isGroupChat && (
                  <span className={`text-[10px] ${msg.seen ? "text-blue-500 font-bold" : "text-gray-400 font-medium"}`}>
                    {msg.seen ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
          );
        })}

        {typingUsers?.includes(selectedUser?._id) && !isGroupChat && (
          <div className="flex items-end gap-3 flex-row">
            <div className="shrink-0 mb-6">
               <img src={selectedUser.profilePic || assets.avatar_icon} className="w-8 h-8 object-cover rounded-full border border-gray-200 shadow-sm" />
            </div>
            <div className="bg-white border border-gray-200 rounded-[1.5rem] rounded-bl-[0.25rem] px-5 py-4 shadow-sm flex items-center gap-1.5 h-10">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        <div ref={scrollEnd} className="h-4"></div>
      </div>

      {/* Message Input Area */}
      <div className="p-4 md:px-6 md:py-5 border-t border-gray-200 bg-white/80 backdrop-blur-md shrink-0">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 w-full bg-gray-100 border border-gray-200 rounded-full px-2 py-2 shadow-sm focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all"
        >
          <label htmlFor="image-upload" className="shrink-0 p-2 cursor-pointer hover:bg-gray-200 rounded-full transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              onChange={handleSendImage}
              type="file"
              id="image-upload"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </label>
          
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none text-gray-800 placeholder-gray-500 focus:outline-none px-2 py-2"
          />
          
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white disabled:opacity-50 disabled:bg-gray-400 hover:bg-blue-700 transition-all duration-200 transform active:scale-95 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex-col items-center justify-center gap-6 hidden md:flex h-full w-full bg-gray-50 border-x border-gray-200">
      <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">NexusChat</h2>
        <p className="text-gray-500 font-medium">Select a conversation or start a new one.</p>
      </div>
    </div>
  );
};

export default ChatContainer;
