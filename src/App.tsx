import React, { useState } from "react";
import Sender from "./components/Sender";
import Receiver from "./components/Receiver";

const App: React.FC = () => {
  const [role, setRole] = useState<"sender" | "receiver" | null>(null);

  return (
    <div className="container">
      <h1>WebRTC Audio Call</h1>
      {!role && (
        <div>
          <button onClick={() => setRole("sender")}>Start as Sender</button>
          <button onClick={() => setRole("receiver")}>Start as Receiver</button>
        </div>
      )}
      {role === "sender" && <Sender />}
      {role === "receiver" && <Receiver />}
    </div>
  );
};

export default App;