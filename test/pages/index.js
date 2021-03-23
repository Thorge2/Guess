import { useEffect, useState } from "react";
import io from "socket.io-client";

const Index = () => {
  const [socket, setSocket] = useState();
  const [admin, setAdmin] = useState();

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const sock = io("http://localhost:4000");
    setSocket(sock);
    sock.on("connect", () => {
      sock.emit("create", (data) => {
        setAdmin(data);
      });
    });

    sock.on("update", (pl) => {
      setPlayers(pl);
    });

    sock.on("buzzed", (na) => {
      alert(`${na} buzzed`);
    });
  }, []);

  const reply = () => {
    socket.emit("reply", admin.game, admin.player, "+1");
  };

  const del = () => {
    socket.emit("delete", admin.game, admin.player);
  };

  return (
    <div>
      <h1>Create Game</h1>

      <button onClick={del}>Delete</button>
      <button onClick={reply}>Reply</button>

      <hr />

      <p>Game id: {admin ? admin.game : "loading..."}</p>
      <p>Player id: {admin ? admin.player : "loading..."}</p>

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

export default Index;
