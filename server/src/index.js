import express from "express";
import cors from "cors";
import http from "http";
import socketio from "socket.io";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json());
app.use(cors());

const get_id = () => uuid().split("-")[0].toUpperCase();
const games = new Map();

app.get("/", (req, res) => {
  res.json({ greeting: "Hello, world" });
});

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("create", (...args) => {
    const callback = args[args.length - 1];

    // construct game object and store it
    const game = {
      admin: get_id(),
      players: [],
      buzzered: "",
    };
    const game_id = get_id();

    games.set(game_id, game);

    // join the user in the game room
    socket.join(game_id);

    // send game data to user
    callback({
      game: game_id,
      player: game.admin,
    });

    console.log(games);
  });

  socket.on("join", (...args) => {
    // check args
    if (args.length < 3) {
      return;
    }

    const game_id = args[0];
    const user_name = args[1];

    if (!user_name || !game_id) {
      return;
    }

    const callback = args[args.length - 1];

    // check if game exists
    if (!games.has(game_id)) {
      return;
    }

    // create player object
    const player = {
      id: get_id(),
      name: user_name,
      score: 0,
    };

    // append player to game object
    const game = games.get(game_id);
    game.players = [...game.players, player];

    // join player to game room
    socket.join(game_id);

    // send back player data
    callback(player);

    // update player list for client
    io.to(game_id).emit("update", game.players);

    console.log(games);
  });

  socket.on("buzzer", (...args) => {});

  socket.on("reply", (...args) => {});

  socket.on("delete", (...args) => {
    // check args
    if (args.length < 3) {
      return;
    }

    const game_id = args[0];
    const admin_id = args[1];

    if (!admin_id || !game_id) {
      return;
    }

    const callback = args[args.length - 1];

    // check if game exists
    if (!games.has(game_id)) {
      return;
    }

    // check if admin
    const game = games.get(game_id);
    if (game.admin !== admin_id) {
      return;
    }

    // delete game
    games.delete(game_id);

    // send update to all
    io.to(game_id).emit("deleted");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
