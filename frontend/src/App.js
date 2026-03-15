import { useState } from "react";

function App() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    const res = await fetch("http://localhost:5000/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    const data = await res.json();
    setChat([...chat, { user: msg }, { bot: data.reply }]);
    setMsg("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Agentic AI Chat</h2>

      {chat.map((c, i) => (
        <p key={i}>
          {c.user && <b>You: {c.user}</b>}
          {c.bot && <span><b>Agent:</b> {c.bot}</span>}
        </p>
      ))}

      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}

export default App;
