import express from "express";
import cors from "cors";
import http from "http";
import socketio from "socket.io";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

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
  socket.on("create", () => {
    // construct game object and store it
    const game = {
      admin_id: get_id(),
      players: [],
      buzzered: "",
    };
    const game_id = get_id();

    games.set(game_id, game);

    // join the user in the game room
    socket.join(game_id);

    // create admin token
    const admin_token = jwt.sign({ user_id: game.admin_id }, process.env.SALT);

    // send game data to user
    socket.emit("created", {
      game_id,
      admin: {
        id: game.admin_id,
        token: admin_token,
      },
    });
  });

  socket.on("join", ({ username, game_id }) => {
    if (!username || !game_id) {
      return;
    }

    console.log(username);

    // check if game exists
    if (!games.has(game_id)) {
      return;
    }

    // create player object
    const player = {
      id: get_id(),
      name: username,
      score: 0,
    };

    // append player to game object
    const game = games.get(game_id);
    game.players = [...game.players, player];

    // join player to game room
    socket.join(game_id);

    // send back player data
    socket.emit("joined", {
      id: player.id,
      name: player.name,
      token: jwt.sign({ user_id: player.id }, process.env.SALT),
    });

    // update player list for client
    io.to(game_id).emit("update", game.players);
  });

  socket.on("buzzer", ({ user_token, game_id }) => {
    const { user_id } = jwt.verify(user_token, process.env.SALT);

    // check if game exists
    if (!games.has(game_id)) {
      return;
    }
    const game = games.get(game_id);

    console.log(user_id);

    // check if no one has buzzered
    if (game.buzzered.length !== 0) {
      return;
    }

    const player = game.players.find((p) => p.id === user_id);
    if (!player) {
      return;
    }

    game.buzzered = player.id;

    io.to(game_id).emit("buzzered", { id: player.id, name: player.name });
  });

  socket.on("reply", ({ game_id, admin_token, method }) => {
    // verify admin
    const admin_id = jwt.verify(admin_token, process.env.SALT).user_id;

    console.log(admin_id);

    // check if game exists
    if (!games.has(game_id)) {
      return;
    }
    const game = games.get(game_id);

    // check if buzzered
    if (game.buzzered.length === 0) {
      return;
    }

    // check if the admin id is valid
    if (admin_id !== game.admin.id) {
      return;
    }

    // parse method
    let adder = 0;
    switch (method) {
      case "+1":
        adder = 1;
        break;
      case "+2":
        adder = 2;
        break;
      case "-1":
        adder = -1;
        break;
      case "0":
        adder = 0;
        break;
      default:
        return;
    }

    // update score
    game.players.map((p) => {
      if (p.id === game.buzzered) {
        p.score += adder;
      }
    });

    // "unbuzzer"
    game.buzzered = "";

    //send update
    io.to(game_id).emit("update", game.players);
  });

  socket.on("delete", ({ game_id, admin_token }) => {
    // verify admin
    const admin_id = jwt.verify(admin_token, process.env.SALT);

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
