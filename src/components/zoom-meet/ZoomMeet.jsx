import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import Webcam from "react-webcam";
import { Slide, Avatar, OutlinedInput, Button } from "@material-ui/core";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import styled from "styled-components";
import { useSelector } from "react-redux";

const AlertStyle = styled.div`
  width: 25%;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 25px 20px 0 #2c2b2b;
`;
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

// const socket = io.connect("http://localhost:5000");
function App() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  // const [mediaStream, setMediaStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [callerInfo, setCallerInfo] = useState({});
  const [partnerSignal, setPartnerSignal] = useState();
  const myVideo = useRef();
  const screenShare = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);

  // useEffect(() => {
  //   return () => {
  //     if (socket && answer && caller) {
  //       console.log(answer);
  //       console.log(caller);
  //       socket.emit("endCall", [answer, me, caller]);
  //     }
  //   };
  // }, [socket, answer, me, caller]);

  useEffect(() => {
    if (stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);
  useEffect(() => {
    if (socket) {
      try {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setStream(stream);
          });
      } catch (ex) {
        console.log("Error occurred", ex);
      }

      socket.on("me", (id) => {
        setMe(id);
      });
      socket.on("callUser", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerInfo(data.user);
        setCallerSignal(data.signal);
      });
      socket.on("endCall", () => {
        setCallEnded(true);
        setCallAccepted(false);
        setReceivingCall(false);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const peer = new Peer({
        initiator: false,
        trickle: false,
      });
      socket.on("shareScreen", (data) => {
        peer.signal(data.signal);
      });
      peer.on("stream",  (stream) => {
        console.log(111,stream);
        document.getElementById("local-video").srcObject = stream;
      });
    }
  }, [socket]);

  const callUser = async (id, streamSrc = stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: streamSrc,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        user: {
          name: user.name,
          avatar: user.avatar,
        },
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", ({ signal, answer }) => {
      setReceivingCall(true);
      setCallEnded(false);
      setCallAccepted(true);
      setPartnerSignal(answer);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const answerCall = () => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, from: me, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    setPartnerSignal(caller);
    setCallEnded(false);
    setCallAccepted(true);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setReceivingCall(false);
    socket.emit("endCall", partnerSignal);
    connectionRef.current.destroy();
  };
  const cancelCall = () => {
    setCallAccepted(false);
    setReceivingCall(false);
    connectionRef.current.destroy();
  };

  const shareScreen = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
   
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: mediaStream,
      });
      peer.on("signal", (data) => {
        socket.emit("shareScreen", {
          userToCall: idToCall,
          from: me,
          signal: data,
        });
      });
      document.getElementById("local-video").srcObject = mediaStream;
      // screenShare.current.srcObject = mediaStream;
    } catch (ex) {
      console.log("Error occurred", ex);
    }
  };

  return (
    <>
      <div className="">
        <div className="mt-5 flex items-end justify-center">
          <video
            id="local-video"
            className="rounded overflow-hidden mx-auto"
            width={1200}
            muted
            autoPlay
          />
          <div className="video">
            {stream && (
              <div>
                <Webcam
                  className="rounded overflow-hidden mx-auto mb-5"
                  audio={false}
                  width={300}
                  screenshotFormat="image/jpeg"
                  ref={myVideo}
                  videoConstraints={videoConstraints}
                />
                {/* <video
                  className="rounded overflow-hidden mx-auto mb-5"
                  width={300}
                  autoPlay
                  ref={myVideo}
                  muted
                /> */}
              </div>
            )}
            {callAccepted && !callEnded ? (
              <video
                className="rounded overflow-hidden mx-auto"
                width={300}
                autoPlay
                ref={userVideo}
                muted
              />
            ) : null}
          </div>
        </div>
        {me}
        <div className="mt-5">
          <OutlinedInput
            placeholder="Please enter text"
            className="bg-white rounded w-1/4"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button mt-2">
            {callAccepted && !callEnded ? (
              <div className="flex gap-3 justify-center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={leaveCall}
                >
                  End Call
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={shareScreen}
                >
                  Share Screen
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                >
                  On Screen Sharing
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => callUser(idToCall)}
              >
                Call
              </Button>
            )}
          </div>
        </div>
        <div className="fixed w-full top-5">
          <Slide
            direction="down"
            in={receivingCall && !callAccepted}
            mountOnEnter
            unmountOnExit
          >
            <AlertStyle>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    style={{ width: 48, height: 48 }}
                    alt="Remy Sharp"
                    src={callerInfo.avatar}
                  />
                  <div>
                    <h1 className="font-bold text-left">{callerInfo.name}</h1>
                    <p className="text-xs text-slate-500">{me}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={answerCall}
                    className="w-12 h-12 rounded-full bg-green-500 mr-3"
                  >
                    <CallIcon style={{ color: "#fff" }} />
                  </button>
                  <button
                    onClick={cancelCall}
                    className="w-12 h-12 rounded-full bg-red-500"
                  >
                    <CallEndIcon style={{ color: "#fff" }} />
                  </button>
                </div>
              </div>
            </AlertStyle>
          </Slide>
        </div>
      </div>
    </>
  );
}

export default App;
