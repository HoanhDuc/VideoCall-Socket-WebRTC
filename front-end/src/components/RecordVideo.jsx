import React from "react";
import Webcam from "react-webcam";

function RecordVideo() {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback((blobUrl) => {
    if (recordedChunks.length) {
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = blobUrl;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    }
  }, [recordedChunks]);

  const handleDelete = React.useCallback((blobUrl)=>{
    const newList = recordedChunks.filter((item) => URL.createObjectURL(item) !== blobUrl);
    setRecordedChunks(newList)
  }, [setRecordedChunks])

  return (
    <div className="mx-auto w-3/4 py-3 text-center">
      <Webcam
        className="rounded overflow-hidden mx-auto"
        audio={false}
        height={500}
        width={1000}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        ref={webcamRef}
      />
      <button
        className={`mt-2 p-2 ${capturing ? 'bg-red-500' : 'bg-green-500'} rounded text-white`}
        onClick={capturing ? handleStopCaptureClick : handleStartCaptureClick}
      >
        {capturing ? "Stop" : "Start"} Record
      </button>

      <div className="flex gap-4 mt-2 overflow-auto p-3">
        {recordedChunks.map((item) => {
          const blobURL = URL.createObjectURL(item);
          return (
            <div className="relative min-w-[250px]">
              <video src={blobURL} width={250} controls />
              <button onClick={() => handleDelete(blobURL)}>
                <img
                  src="https://www.pngall.com/wp-content/uploads/6/Delete-Button-PNG-Download-Image.png"
                  width={32}
                  alt=""
                  className="absolute top-[-20px] right-[-10px]"
                />
              </button>
              <button onClick={() => handleDownload(blobURL)}>
                <img
                  src="https://freeiconshop.com/wp-content/uploads/edd/download-flat.png"
                  width={25}
                  alt=""
                  className="absolute top-[-10px] right-[25px]"
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecordVideo;
