import { useEffect, useState } from "react";
import io from "socket.io-client";

const Index = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState();

  const [players, setPlayers] = useState([]);

  const create = () => {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      socket.emit("create", (data) => {
        setData(data);
      });
    });

    socket.on("update", (data) => {
      setPlayers(data);
    });
  };

  return (
    <div>
      <h1>Create Game</h1>

      <button onClick={create}>Create</button>

      <hr />

      <p>Game id: {data ? data.game : "loading..."}</p>
      <p>Player id: {data ? data.player : "loading..."}</p>

      <hr />

      <h3>Players</h3>

      <ul>
        {players.map((p, i) => (
          <li key={i}>
            {p.name} | {p.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
