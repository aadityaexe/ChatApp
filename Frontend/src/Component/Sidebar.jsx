import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const {
    getUsers,
    users,
    groups,
    selectedUser,
    setSelectedUser,
    setIsGroupChat,
    unseenMessages,
    setUnseenMessages,
    searchGlobalUsers,
    searchResults,
    friendRequests,
    sendFriendRequest,
    respondToRequest
  } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("chats"); // chats, groups, network
  const [searchInput, setSearchInput] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  // Handle Search in Network tab
  useEffect(() => {
    if (activeTab === "network") {
      const delayDebounceFn = setTimeout(() => {
        searchGlobalUsers(searchInput);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchInput, activeTab]);

  const filteredUsers = activeTab === "chats" && searchInput
    ? users.filter((user) => user.fullName.toLowerCase().includes(searchInput.toLowerCase()))
    : users;

  const filteredGroups = activeTab === "groups" && searchInput
    ? groups.filter((group) => group.name.toLowerCase().includes(searchInput.toLowerCase()))
    : groups;

  return (
    <div
      className={`bg-gray-50/50 border-r border-gray-200 h-full p-6 flex flex-col text-gray-800 ${
        selectedUser ? "hidden md:flex" : "flex"
      }`}
    >
      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
      
      {/* Header */}
      <div className="pb-6 shrink-0 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-xl font-extrabold text-blue-800 hover:text-blue-900 transition-colors cursor-default tracking-tight">
          NexusChat
        </h1>
        <div className="relative group">
          <div className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
          </div>
          <div className="absolute top-full right-0 z-50 w-40 mt-2 p-2 rounded-2xl bg-white border border-gray-200 text-gray-700 hidden group-hover:block shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
            <p onClick={() => navigate("/profile")} className="cursor-pointer text-sm font-medium p-2.5 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-colors flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               My Profile
            </p>
            <div className="h-px bg-gray-100 my-1 mx-2"></div>
            <p onClick={() => logout()} className="cursor-pointer text-sm font-medium p-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               Sign Out
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mt-6 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200 shrink-0">
        {["chats", "groups", "network"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearchInput(""); }}
            className={`flex-1 py-1.5 text-sm rounded-lg capitalize transition-all duration-200 ${
              activeTab === tab 
                ? "bg-white text-blue-700 font-bold shadow-sm border border-gray-200" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl flex items-center gap-3 py-3 px-4 mt-5 border border-gray-200 shrink-0 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all duration-200 shadow-sm">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
         </svg>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          className="bg-transparent border-none outline-none text-gray-800 text-sm placeholder-gray-400 flex-1"
          placeholder={activeTab === "network" ? "Find new people..." : `Search ${activeTab}...`}
        />
      </div>

      {/* + Create Group Button */}
      {activeTab === "groups" && (
        <button 
          onClick={() => setShowCreateGroup(true)}
          className="mt-4 w-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] shrink-0"
        >
          + Create New Group
        </button>
      )}

      {/* Lists */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-1 custom-scrollbar pr-1">
        
        {/* CHATS TAB */}
        {activeTab === "chats" && filteredUsers.map((user) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setIsGroupChat(false);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            key={user._id}
            className={`relative flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
              selectedUser?._id === user._id 
                ? "bg-blue-50 border border-blue-100 shadow-sm" 
                : "hover:bg-gray-100 border border-transparent"
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt=""
                className={`w-12 h-12 object-cover rounded-full transition-all duration-200 ${selectedUser?._id === user._id ? "ring-2 ring-blue-400" : "ring-1 ring-gray-200"}`}
              />
              {onlineUsers.includes(user._id) && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className={`font-semibold truncate text-[15px] ${selectedUser?._id === user._id ? "text-blue-900" : "text-gray-800"}`}>{user.fullName}</p>
              <p className={`text-xs truncate font-medium ${selectedUser?._id === user._id ? "text-blue-600" : "text-gray-500"}`}>{onlineUsers.includes(user._id) ? 'Active now' : 'Offline'}</p>
            </div>
            {unseenMessages[user._id] > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {unseenMessages[user._id]}
              </span>
            )}
          </div>
        ))}

        {/* GROUPS TAB */}
        {activeTab === "groups" && filteredGroups.map((group) => (
          <div
            onClick={() => {
              setSelectedUser(group);
              setIsGroupChat(true);
              setUnseenMessages((prev) => ({ ...prev, [group._id]: 0 }));
            }}
            key={group._id}
            className={`relative flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
              selectedUser?._id === group._id 
                ? "bg-blue-50 border border-blue-100 shadow-sm" 
                : "hover:bg-gray-100 border border-transparent"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex justify-center items-center text-xl font-bold overflow-hidden shrink-0 transition-all ${
               selectedUser?._id === group._id 
                 ? "bg-white ring-2 ring-blue-400 text-blue-600" 
                 : "bg-gray-200 text-gray-500 ring-1 ring-gray-300"
            }`}>
               {group.groupImage ? <img src={group.groupImage} className="w-full h-full object-cover"/> : group.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className={`font-semibold truncate text-[15px] ${selectedUser?._id === group._id ? "text-blue-900" : "text-gray-800"}`}>{group.name}</p>
              <p className={`text-xs truncate font-medium ${selectedUser?._id === group._id ? "text-blue-600" : "text-gray-500"}`}>{group.members.length} members</p>
            </div>
            {unseenMessages[group._id] > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {unseenMessages[group._id]}
              </span>
            )}
          </div>
        ))}

        {/* NETWORK TAB */}
        {activeTab === "network" && (
          <div className="space-y-6">
            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <div className="mb-6">
                <p className="text-[11px] text-blue-600 font-bold uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Requests ({friendRequests.length})
                </p>
                {friendRequests.map(req => (
                  <div key={req._id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-2xl mb-2 shadow-sm">
                    <img src={req.profilePic || assets.avatar_icon} className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200" />
                    <p className="text-sm font-semibold flex-1 truncate text-gray-800">{req.fullName}</p>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => respondToRequest(req._id, "accept")} className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-xl transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </button>
                      <button onClick={() => respondToRequest(req._id, "reject")} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition border border-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {searchInput && (
              <div>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-3 px-2">Search Results</p>
                {searchResults.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                     <p className="text-sm text-gray-500 italic">No users found for "{searchInput}"</p>
                  </div>
                ) : (
                  searchResults.map(user => {
                    const isFriend = users.find(u => u._id === user._id);
                    return (
                      <div key={user._id} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-2xl mb-2 transition border border-transparent hover:border-gray-200">
                        <img src={user.profilePic || assets.avatar_icon} className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-gray-800">{user.fullName}</p>
                        </div>
                        {isFriend ? (
                           <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 border border-green-200 px-2.5 py-1.5 rounded-lg shadow-sm">Friend</span>
                        ) : (
                          <button 
                            onClick={() => sendFriendRequest(user._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm shrink-0 active:scale-95"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )}
            
            {!searchInput && friendRequests.length === 0 && (
              <div className="text-center flex flex-col items-center justify-center mt-12 opacity-60">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                 </svg>
                 <p className="text-sm text-gray-500 font-medium">Search to find friends!</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Sidebar;
