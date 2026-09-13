import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Connecting to server...");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage("Unable to connect to server");
      });
  }, []);

  return (
    <main>
      <h1>InternTrack</h1>

      <p>OJT & Internship Application Tracker</p>

      <p>
        Server status: <strong>{message}</strong>
      </p>
    </main>
  );
}

export default App;