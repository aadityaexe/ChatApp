import React from "react";
import assets from "../assets/assets";

const RightSidebar = ({ selectedUser }) => {
  return (
    selectedUser && (
      <div
        className={`overflow-y-scroll bg-[#818582]/10 text-white w-full relative ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto ">
          <img
            className=" w-20 aspect-[1/1] rounded-full"
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
          />
          <h1 className="gap-2 px-10 text-xl font-medium mx-auto flex items-center">
            <p className=" w-2 h-2 rounded-full bg-green-500"></p>
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
      </div>
    )
  );
};

export default RightSidebar;
