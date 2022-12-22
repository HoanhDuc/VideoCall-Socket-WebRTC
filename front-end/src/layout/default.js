import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "../App.css";
function DefaultLayout() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const pathName = React.useMemo(
    () => location.pathname,
    [location]
  );

  const menu = [
    {
      name: "Home",
      to: "/",
    },
    {
      name: "Test Webcam",
      to: "/webcam",
    },
    {
      name: "Record Webcam",
      to: "/record",
    },
    {
      name: "Zoom Meet",
      to: "/zoom-meet",
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={user.avatar}
          width={50}
          className="rounded-full absolute right-5"
          alt=""
        />
        <div className="flex gap-4 justify-center">
          {menu.map((item) => (
            <Link
              to={item.to}
              className={`p-2 border border-blue-500 ${
                pathName === item.to && "bg-blue-500"
              } rounded text-white`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Outlet />
      </header>
    </div>
  );
}

export default DefaultLayout;
