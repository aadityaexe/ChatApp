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
      className={`bg-gray-900/80 backdrop-blur-xl border-r border-gray-700 h-full p-4 rounded-l-2xl overflow-hidden flex flex-col text-white ${
        selectedUser ? "hidden md:flex" : "flex"
      }`}
    >
      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
      
      {/* Header */}
      <div className="pb-4 shrink-0 flex items-center justify-between border-b border-gray-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">NexusChat</h1>
        <div className="relative group">
          <img
            src={assets.menu_icon}
            alt="Menu"
            className="h-5 cursor-pointer invert"
          />
          <div className="absolute top-full right-0 z-50 w-36 mt-2 p-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 hidden group-hover:block shadow-xl">
            <p onClick={() => navigate("/profile")} className="cursor-pointer text-sm p-2 hover:bg-gray-700 rounded-lg transition">Profile</p>
            <p onClick={() => logout()} className="cursor-pointer text-sm p-2 text-red-400 hover:bg-gray-700 rounded-lg transition">Log Out</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mt-4 bg-gray-800/50 p-1 rounded-lg shrink-0">
        {["chats", "groups", "network"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearchInput(""); }}
            className={`flex-1 py-1 text-sm rounded capitalize transition-all ${
              activeTab === tab ? "bg-indigo-600 shadow-md text-white font-semibold" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 rounded-xl flex items-center gap-2 py-2 px-3 mt-4 border border-gray-700 shrink-0 focus-within:border-indigo-500 transition-colors">
        <img src={assets.search_icon} alt="Search" className="w-4 opacity-50" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 flex-1"
          placeholder={activeTab === "network" ? "Find new people..." : `Search ${activeTab}...`}
        />
      </div>

      {/* + Create Group Button */}
      {activeTab === "groups" && (
        <button 
          onClick={() => setShowCreateGroup(true)}
          className="mt-3 w-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white py-2 rounded-xl text-sm font-medium transition shrink-0"
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
            className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedUser?._id === user._id ? "bg-indigo-600 shadow-lg" : "hover:bg-gray-800"
            }`}
          >
            <div className="relative">
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt=""
                className="w-10 h-10 object-cover rounded-full ring-2 ring-gray-700"
              />
              {onlineUsers.includes(user._id) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{onlineUsers.includes(user._id) ? 'Active now' : 'Offline'}</p>
            </div>
            {unseenMessages[user._id] > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
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
            className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedUser?._id === group._id ? "bg-indigo-600 shadow-lg" : "hover:bg-gray-800"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex justify-center items-center text-lg font-bold shadow-inner ring-2 ring-gray-700 overflow-hidden">
               {group.groupImage ? <img src={group.groupImage} className="w-full h-full object-cover"/> : group.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{group.name}</p>
              <p className="text-xs text-gray-400 truncate">{group.members.length} members</p>
            </div>
            {unseenMessages[group._id] > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                {unseenMessages[group._id]}
              </span>
            )}
          </div>
        ))}

        {/* NETWORK TAB */}
        {activeTab === "network" && (
          <div className="space-y-4">
            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <div>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2 px-1">Friend Requests</p>
                {friendRequests.map(req => (
                  <div key={req._id} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-xl mb-1 border border-gray-700/50">
                    <img src={req.profilePic || assets.avatar_icon} className="w-8 h-8 rounded-full" />
                    <p className="text-sm flex-1 truncate">{req.fullName}</p>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => respondToRequest(req._id, "accept")} className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white p-1.5 rounded-lg transition">✓</button>
                      <button onClick={() => respondToRequest(req._id, "reject")} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white p-1.5 rounded-lg transition">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {searchInput && (
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 px-1">Global Search</p>
                {searchResults.length === 0 ? (
                  <p className="text-sm text-gray-500 italic px-2">No users found.</p>
                ) : (
                  searchResults.map(user => {
                    const isFriend = users.find(u => u._id === user._id);
                    return (
                      <div key={user._id} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-xl mb-1 transition">
                        <img src={user.profilePic || assets.avatar_icon} className="w-8 h-8 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{user.fullName}</p>
                        </div>
                        {isFriend ? (
                           <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-md">Friend</span>
                        ) : (
                          <button 
                            onClick={() => sendFriendRequest(user._id)}
                            className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition shadow flex-shrink-0"
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
              <div className="text-center text-gray-500 text-sm mt-10">
                <p>Search above to find friends!</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Sidebar;
