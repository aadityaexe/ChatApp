import React, { useContext, useState, useRef } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile, changePassword } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio || "");
  const [isHovering, setIsHovering] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef(null);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  const onPasswordSubmitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    const success = await changePassword({ currentPassword, newPassword });
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden p-4 sm:p-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/50 rounded-bl-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100/50 rounded-tr-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left: Avatar Upload Section */}
        <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
          <div 
            className="relative w-48 h-48 rounded-full rounded-2xl border-4 border-gray-100 overflow-hidden cursor-pointer group shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : (authUser?.profilePic || assets.avatar_icon)}
              alt="Profile"
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovering ? 'scale-110 blur-sm brightness-75' : ''}`}
            />
            {/* Overlay */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mb-2 shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <span className="text-white text-sm font-medium shadow-sm">Change Photo</span>
            </div>
            <input
              ref={fileInputRef}
              onChange={(e) => {
                 if(e.target.files && e.target.files[0]) {
                     setSelectedImage(e.target.files[0]);
                 }
              }}
              type="file"
              className="hidden"
              accept=".png, .jpg, .jpeg"
            />
          </div>
          <p className="text-gray-500 text-sm text-center">
            Allowed formats: JPG, PNG. <br/> Max size: 5MB.
          </p>
        </div>

        {/* Right: Form Details */}
        <form onSubmit={onSubmitHandler} className="w-full md:w-2/3 flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h2>
            <p className="text-gray-500">Update your personal information and bio here.</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-semibold ml-1">Full Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                placeholder="Your Name"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-semibold ml-1">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                placeholder="Write a short bio about yourself..."
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 resize-none h-32"
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 mt-2">
             <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-md shadow-blue-500/30"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Change Password Section */}
        <hr className="w-full border-gray-200 mt-6" />

        <form onSubmit={onPasswordSubmitHandler} className="w-full mt-6 flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Security</h3>
            <p className="text-gray-500 text-sm">Update your password to keep your account secure.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <input
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
                type="password"
                required
                placeholder="Current Password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-400/10 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                type="password"
                required
                placeholder="New Password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-400/10 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                required
                placeholder="Confirm New Password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-400/10 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!currentPassword || !newPassword || !confirmPassword}
              className="py-3 px-6 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-100"
            >
              Update Password
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProfilePage;
