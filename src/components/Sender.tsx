import React, { useState, useRef } from "react";

const Sender: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [, setIsCalling] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  const startCall = async () => {
    if (!username || !receiver) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = async (event) => {
      const audioData = event.inputBuffer.getChannelData(0);
      const audioBlob = new Blob([audioData], { type: "audio/wav" });

      await fetch("https://cyber-secuirty-frontend.vercel.app/audio_stream", {
        method: "POST",
        headers: { "Content-Type": "audio/wav" },
        body: audioBlob,
      });
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    await fetch("https://cyber-secuirty-frontend.vercel.app/offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offer),
    });

    setIsCalling(true);
  };

  return (
    <div>
      <h1>Sender</h1>
      <input
        type="text"
        placeholder="Your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Receiver username"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <button onClick={startCall} disabled={!username || !receiver}>
        Start Call
      </button>
    </div>
  );
};

export default Sender;