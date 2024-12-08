import React, { useState, useRef } from "react";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(event.data);
          reader.onloadend = async () => {
            const audioData = reader.result;

            // Send the audio data to the serverless function
            await fetch("https://cybersecuritybackend-clgcft64w-pratikk94s-projects.vercel.app/api/audio-stream", {
              method: "POST",
              headers: {
                "Content-Type": "application/octet-stream",
              },
              body: audioData,
            });
          };
        }
      };

      mediaRecorder.start(100); // Send audio data every 100ms
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing the microphone:", error);
      alert("Could not access your microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Audio Recorder</h1>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          padding: "10px 20px",
          margin: "10px",
          background: isRecording ? "red" : "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default AudioRecorder;