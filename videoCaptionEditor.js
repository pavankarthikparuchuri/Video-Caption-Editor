import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";

const VideoCaptionEditor = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [currentCaption, setCurrentCaption] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [playing, setPlaying] = useState(false); // To track whether video is playing or paused
  const playerRef = useRef(null);
  const [inputCaption, setInputCaption] = useState("");

  const loadVideo = () => {
    if (videoUrl) {
      setIsVideoLoaded(true); // Set the flag to indicate the video is loaded
    }
    setCaptions([]);
    setInputCaption("");
    setStartTime("");
    setEndTime("");
  };

  const addCaption = () => {
    const start = parseFloat(startTime);
    const end = parseFloat(endTime);

    if (!inputCaption || isNaN(start) || isNaN(end)) {
      alert("Please fill in all fields.");
      return;
    }

    if (start<0 || end<0) {
        alert("start or endtime can't be negative");
        return;
      }

    if (end <= start) {
      alert("End time must be greater than start time.");
      return;
    }

    // Check for overlapping intervals
    const isOverlapping = captions.some(
      (caption) =>
        (start >= caption.start && start < caption.end) || // New start overlaps existing interval
        (end > caption.start && end <= caption.end) || // New end overlaps existing interval
        (start <= caption.start && end >= caption.end) // New interval encompasses existing interval
    );

    if (isOverlapping) {
      alert("The new caption overlaps with an existing caption time stamp.");
      return;
    }
    if (inputCaption && startTime && endTime) {
      setCaptions([
        ...captions,
        {
          text: inputCaption,
          start: parseFloat(startTime),
          end: parseFloat(endTime),
        },
      ]);
      setInputCaption("");
      setStartTime("");
      setEndTime("");
    }
  };

  const getCurrentCaption = (currentTime) => {
    const activeCaption = captions.find(
      (caption) => currentTime >= caption.start && currentTime <= caption.end
    );
    return activeCaption ? activeCaption.text : "";
  };

  const togglePlayPause = () => {
    setPlaying(!playing); // Toggle play/pause state
  };

  return (
    <div
      style={{
        textAlign: "center",
        minHeight: "74vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Enter video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={loadVideo}
          style={{
            padding: "10px",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          Load Video
        </button>
      </div>
      {isVideoLoaded && (
        <>
          <div
            style={{
              position: "relative",
              width: "70%",
              maxWidth: "800px",
              margin: "5px auto",
              aspectRatio: "16/9", // Maintains a responsive aspect ratio
              backgroundColor: "black",
            }}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing={playing}
              controls={true}
              width="100%"
              height="100%"
              onProgress={({ playedSeconds }) => {
                setCurrentCaption(getCurrentCaption(playedSeconds));
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                padding: "5px 10px",
                fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                borderRadius: "5px",
                textAlign: "center",
                pointerEvents: "none",
                maxWidth: "90%",
                wordBreak: "break-word",
              }}
            >
              {currentCaption}
            </div>
          </div>
          <div>
            <button
              onClick={togglePlayPause}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
              }}
            >
              Play/Pause
            </button>
          </div>
          <div
            style={{
              width: "90%",
              maxWidth: "600px",
            //   marginTop: "5px",
            }}
          >
            <h3 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)" }}>Add Caption</h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <input
                type="text"
                placeholder="Caption text"
                value={inputCaption}
                onChange={(e) => setInputCaption(e.target.value)}
                style={{
                  flex: "2",
                  padding: "10px",
                  fontSize: "0.8rem",
                  minWidth: "150px",
                }}
              />
              <input
                type="number"
                placeholder="StartTime(sec)"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min="0"
                style={{
                  flex: "1",
                  padding: "10px",
                  fontSize: "0.8rem",
                  minWidth: "100px",
                }}
              />
              <input
                type="number"
                placeholder="EndTime(sec)"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min="0"
                style={{
                  flex: "1",
                  padding: "10px",
                  fontSize: "0.8rem",
                  minWidth: "100px",
                }}
              />
              <button
                onClick={addCaption}
                style={{
                  flex: "1",
                  padding: "10px",
                  fontSize: "0.8rem",
                  margin: "5px",
                  minWidth: "100px",
                }}
              >
                Add Caption
              </button>
            </div>
          </div>
          <div
            style={{
              marginTop: "5px",
              width: "90%",
              maxWidth: "600px",
              overflowY: "auto",
              maxHeight: "200px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              textAlign: "left",
            }}
          >
            <h4
              style={{
                position: "sticky",
                top: "0",
                backgroundColor: "#fff",
                zIndex: "10",
                padding: "5px 0",
                marginBottom: "10px",
              }}
            >
              Captions List
            </h4>
            {captions.map((caption, index) => (
              <div key={index} style={{ marginBottom: "5px", wordBreak: "break-word" }}>
                {caption.start}s - {caption.end}s: {caption.text}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCaptionEditor;
