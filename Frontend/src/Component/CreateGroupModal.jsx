import React, { useState, useContext } from "react";
import { ChatContext } from "../Context/ChatContext";
import assets from "../assets/assets";

const CreateGroupModal = ({ onClose }) => {
  const { users, createGroup } = useContext(ChatContext);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreate = () => {
    if (!groupName.trim()) return alert("Group name is required");
    if (selectedMembers.length === 0) return alert("Select at least 1 member");

    createGroup({
      name: groupName,
      members: selectedMembers,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
          <h2 className="text-lg font-bold text-white">Create New Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">✕</button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder="E.g. Squad Goals"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Add Friends</label>
            {users.length === 0 ? (
              <p className="text-sm text-gray-500 italic">You don't have any friends yet.</p>
            ) : (
              <div className="space-y-2">
                {users.map((friend) => (
                  <div 
                    key={friend._id} 
                    onClick={() => toggleMember(friend._id)}
                    className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-800/80 cursor-pointer border border-transparent hover:border-gray-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={friend.profilePic || assets.avatar_icon} className="w-8 h-8 rounded-full" />
                      <p className="text-sm font-medium text-gray-200">{friend.fullName}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMembers.includes(friend._id) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'}`}>
                      {selectedMembers.includes(friend._id) && <span className="text-white text-xs font-bold leading-none">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition font-medium">Cancel</button>
          <button onClick={handleCreate} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-lg shadow-indigo-600/20">Create Group</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
