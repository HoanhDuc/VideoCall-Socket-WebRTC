import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../logo.svg";
import "../App.css";
function Home(props) {
  return (
    <div className="">
      <img className="mx-auto App-logo" src={logo} alt="logo" />
    </div>
  );
}

export default Home;
