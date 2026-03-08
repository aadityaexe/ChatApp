import React, { useContext, useEffect } from "react";
import { CallContext } from "../Context/CallContext";
import assets from "../assets/assets";

const CallScreen = () => {
  const {
    callAccepted,
    callEnded,
    receivingCall,
    callerName,
    callerPic,
    isCalling,
    isAudioMuted,
    isVideoOff,
    toggleAudio,
    toggleVideo,
    myVideo,
    userVideo,
    answerCall,
    leaveCall,
    stream
  } = useContext(CallContext);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [isCalling, callAccepted, stream, myVideo]);

  // If not receiving a call and not actively calling, don't render anything
  if (!receivingCall && !isCalling && !callAccepted) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      
      {/* Incoming Call Ringing UI */}
      {receivingCall && !callAccepted && !callEnded && (
        <div className="flex flex-col items-center animate-pulse-slow">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
            <img 
              src={callerPic || assets.avatar_icon} 
              alt="Caller" 
              className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] z-10 relative"
            />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">{callerName}</h2>
          <p className="text-gray-400 mb-8">Incoming video call...</p>
          
          <div className="flex gap-8">
            <button 
              onClick={leaveCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex justify-center items-center shadow-lg transition transform hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white rotate-[135deg]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
            <button 
              onClick={answerCall}
              className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex justify-center items-center shadow-lg shadow-green-500/30 transition transform hover:scale-110 animate-bounce"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Active Call UI or Calling UI */}
      {(callAccepted || isCalling) && !callEnded && (
        <div className="w-full h-full max-w-6xl mx-auto flex flex-col relative">
          {/* Header */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">
             <p className="text-white font-medium flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                 {callAccepted ? "Live Call" : "Calling..."}
             </p>
          </div>

          <div className="flex-1 w-full flex flex-col md:flex-row gap-4 justify-center items-center p-4">
            {/* User Video (Remote) */}
            <div className="relative w-full md:w-2/3 aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl flex items-center justify-center">
              {callAccepted ? (
                <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                    <img src={assets.avatar_icon} className="w-20 h-20 opacity-30 mb-4" />
                    <p className="animate-pulse">Waiting for answer...</p>
                </div>
              )}
            </div>

            {/* My Video (Local) */}
            <div className={`relative aspect-video bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-xl transition-all duration-500 ${callAccepted ? 'w-1/3 md:absolute md:bottom-8 md:right-8 md:w-64 md:z-20' : 'w-full md:w-1/3'}`}>
              <video playsInline muted ref={myVideo} autoPlay className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff ? 'hidden' : 'block'}`} />
              {isVideoOff && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                   <img src={assets.avatar_icon} className="w-16 h-16 opacity-50 mb-2" />
                   <p className="text-gray-400 text-xs text-center">Camera Off</p>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white z-20">You {isAudioMuted && "(Muted)"}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-md px-8 py-4 rounded-full border border-gray-700 flex gap-6 shadow-2xl z-30 items-center">
             
             {/* Mic Toggle */}
             <button
               onClick={toggleAudio}
               className={`w-14 h-14 rounded-full flex justify-center items-center shadow-lg transition transform hover:scale-105 ${isAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
               title={isAudioMuted ? "Unmute" : "Mute"}
             >
               {isAudioMuted ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                 </svg>
               )}
             </button>

             {/* End Call */}
             <button 
              onClick={leaveCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex justify-center items-center shadow-lg transition transform hover:scale-105"
              title="End Call"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white rotate-[135deg]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
             </button>

             {/* Video Toggle */}
             <button
               onClick={toggleVideo}
               className={`w-14 h-14 rounded-full flex justify-center items-center shadow-lg transition transform hover:scale-105 ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
               title={isVideoOff ? "Turn on camera" : "Turn off camera"}
             >
               {isVideoOff ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                 </svg>
               )}
             </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default CallScreen;
