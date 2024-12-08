import React, { useEffect, useRef, useState } from "react";

const Receiver: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      const response = await fetch("https://cyber-security-pi.vercel.app/audio_stream");
      const audioStream = response.body;

      if (audioStream && audioRef.current) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(audioContext.destination);

        const reader = audioStream.getReader();
        const processAudio = async () => {
          const { value, done } = await reader.read();
          if (done) return;

          const audioBlob = new Blob([value], { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioRef.current!.src = audioUrl;
          audioRef.current!.play();
        };

        processAudio();
      }
    };

    fetchAudio();
  }, []);

  return (
    <div>
      <h1>Receiver</h1>
      <input
        type="text"
        placeholder="Your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <audio ref={audioRef} controls autoPlay />
    </div>
  );
};

export default Receiver;