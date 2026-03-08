import { createContext, useState, useRef, useEffect, useContext } from "react";
import Peer from "simple-peer";
import { AuthContext } from "./AuthContext";

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerPic, setCallerPic] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [calledUser, setCalledUser] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  
  const { socket, authUser } = useContext(AuthContext);

  useEffect(() => {
    if (!socket || !authUser) return;

    // Use a function here so we can call it when answering or calling
    const requestMedia = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Failed to get local stream", err);
      }
    };
    
    // We can request media lazily when a call starts or is received

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerName(data.name);
      setCallerPic(data.profilePic);
      setCallerSignal(data.signal);
    });

    socket.on("callEnded", () => {
      setCallEnded(true);
      cleanupCall();
    });

    return () => {
      socket.off("callUser");
      socket.off("callEnded");
    };
  }, [socket, authUser]);

  const callUser = async (idToCall) => {
    if (!stream) {
        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(currentStream);
            if(myVideo.current) myVideo.current.srcObject = currentStream;
            executeCall(idToCall, currentStream);
        } catch (err) {
            console.error("Failed to get stream", err);
        }
    } else {
        executeCall(idToCall, stream);
    }
  };

  const executeCall = (idToCall, currentStream) => {
    setIsCalling(true);
    setCalledUser(idToCall);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" }
        ]
      },
      stream: currentStream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: idToCall,
        signalData: data,
        from: authUser._id,
        name: authUser.fullName,
        profilePic: authUser.profilePic
      });
    });

    peer.on("stream", (userStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = userStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = async () => {
    setCallAccepted(true);
    
    let currentStream = stream;
    if (!currentStream) {
        try {
            currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(currentStream);
            if(myVideo.current) myVideo.current.srcObject = currentStream;
        } catch (err) {
            console.error("Failed to get stream", err);
        }
    }

    const peer = new Peer({
      initiator: false,
      trickle: false,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" }
        ]
      },
      stream: currentStream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (userStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = userStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if(connectionRef.current) {
        connectionRef.current.destroy();
    }
    socket.emit("endCall", { to: caller || calledUser });
    cleanupCall();
  };

  const cleanupCall = () => {
      setReceivingCall(false);
      setCallAccepted(false);
      setIsCalling(false);
      setCalledUser("");
      setCaller("");
      setCallerName("");
      setCallerPic("");
      setIsAudioMuted(false);
      setIsVideoOff(false);
      if(stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
      }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <CallContext.Provider
      value={{
        callUser,
        answerCall,
        leaveCall,
        myVideo,
        userVideo,
        stream,
        callAccepted,
        callEnded,
        receivingCall,
        caller,
        callerName,
        callerPic,
        isCalling,
        isAudioMuted,
        isVideoOff,
        toggleAudio,
        toggleVideo
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
