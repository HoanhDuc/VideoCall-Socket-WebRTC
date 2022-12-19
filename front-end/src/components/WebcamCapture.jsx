import React, { useState, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamComponent = () => {
  const [listPhoto, setListPhoto] = useState([]);

  const onDeleteImage = (url) => {
    const newList = listPhoto.filter((item) => item !== url);
    setListPhoto(newList)
  };
  return (
    <div className="mx-auto w-3/4 py-3 text-center">
      <Webcam
        className="rounded overflow-hidden mx-auto"
        audio={false}
        height={500}
        screenshotFormat="image/jpeg"
        width={1000}
        videoConstraints={videoConstraints}
      >
        {({ getScreenshot }) => (
          <div className="mt-2">
            <button
              className="p-2 mr-2 bg-green-500 rounded text-white"
              onClick={() => {
                setListPhoto([...listPhoto, getScreenshot()]);
              }}
            >
              Capture photo
            </button>
            <button
              className="p-2 bg-red-500 rounded text-white"
              onClick={() => {
                setListPhoto([]);
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </Webcam>
      <div className="flex gap-4 mt-2 overflow-auto p-3">
        {listPhoto.map((url) => (
          <div className="relative min-w-[250px]">
            <img className="rounded" src={url} width={250} alt="" />
            <button onClick={() => onDeleteImage(url)}>
              <img
                src="https://www.pngall.com/wp-content/uploads/6/Delete-Button-PNG-Download-Image.png"
                width={30}
                alt=""
                className="absolute top-[-20px] right-[-10px]"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebcamComponent;
