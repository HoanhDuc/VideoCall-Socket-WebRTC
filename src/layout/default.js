import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "../App.css";
function DefaultLayout() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="App">
      <header className="App-header">
        <img src={user.avatar} width={50} className="rounded-full absolute right-5" alt="" />
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="p-2 border border-blue-500 rounded text-white"
          >
            Home
          </Link>
          <Link
            to="/webcam"
            className="p-2 border border-blue-500 rounded text-white"
          >
            Test Webcam
          </Link>
          <Link
            to="/record"
            className="p-2 border border-blue-500 rounded text-white"
          >
            Record Webcam
          </Link>
          <Link
            to="/zoom-meet"
            className="p-2 border border-blue-500 rounded text-white"
          >
            Zoom Meet
          </Link>
        </div>
        <Outlet />
      </header>
    </div>
  );
}

export default DefaultLayout;
