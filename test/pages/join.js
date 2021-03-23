import { useState } from "react";
import io from "socket.io-client";

const Join = () => {
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [data, setData] = useState();
  const [socket, setSocket] = useState();
  const [players, setPlayers] = useState([]);

  const join = () => {
    const sock = io("http://localhost:4000");
    setSocket(sock);
    sock.on("connect", () => {
      sock.emit("join", game, name, (data) => {
        setData(data);
      });
    });

    sock.on("update", (data) => {
      setPlayers(data);
    });

    sock.on("buzzed", (data) => {
      console.log(data);
    });

    sock.on("deleted", () => {
      console.log("deleted");
    });
  };

  return (
    <div>
      <h1>Join Game</h1>
      <br />

      <label>User Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <br />
      <br />

      <label>Game id</label>
      <input
        type="text"
        value={game}
        onChange={(e) => setGame(e.target.value)}
      ></input>

      <br />
      <br />

      <button onClick={join}>Join</button>
      <button onClick={() => socket.emit("buzzer", game, data.id)}>Buzz</button>

      <hr />

      <p>Player id: {data ? data.id : "loading..."}</p>
      <p>Player name: {data ? data.name : "loading..."}</p>
      <p>Player Score: {data ? data.score : "loading..."}</p>

      <hr />

      <h3>Players</h3>

      <ul>
        {players.map((p, i) => (
          <li key={i}>
            {p.name} | {p.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Join;
