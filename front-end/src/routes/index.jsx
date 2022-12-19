import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebcamCapture from "../components/WebcamCapture";
import RecordVideo from "../components/RecordVideo";
import ZoomMeet from "../components/zoom-meet/ZoomMeet";
import Home from "../pages/Home";
import DefaultLayout from "../layout/default";
import { checkAuth } from "../api/gapi";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setSocket } from "../store/socket";

export default function AppRouter() {
  const socket = React.useMemo(() => {
    console.log(12123);
    return io.connect("https://video-call-socket-web-rtc-px2i.vercel.app/");
  }, []);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setSocket(socket));
    checkAuth();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="/webcam" element={<WebcamCapture />} />
          <Route path="/record" element={<RecordVideo />} />
          <Route path="/zoom-meet" element={<ZoomMeet />} />
        </Route>
      </Routes>
    </Router>
  );
}
