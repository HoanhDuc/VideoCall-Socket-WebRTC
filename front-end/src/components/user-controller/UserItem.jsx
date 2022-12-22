import React from "react";

export default function UserItem({ user, onCall }) {
  return (
    <div className="flex items-center gap-2 bg-white p-2 px-4 rounded-lg">
      <div className="relative">
        <img src={user.avatar} width={40} className="rounded-full" alt="" />
        <img
          width={10}
          className="absolute bottom-0 right-0"
          src="https://icon-library.com/images/online-icon-png/online-icon-png-6.jpg"
          alt=""
        />
      </div>
      <p> {user.name}</p>
      <img
        role="button"
        width={50}
        src="https://e7.pngegg.com/pngimages/915/706/png-clipart-blue-call-icon-dialer-android-google-play-telephone-phone-blue-text.png"
        alt=""
        onClick={() => onCall(user.socketId)}
      />
    </div>
  );
}
