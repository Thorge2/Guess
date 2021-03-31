import { onMount } from "svelte";
import { writable } from "svelte/store";

const url = "http://localhost:4000";

let socket = new Promise(() => {});

const createGame = () => {
  const gameInfo = writable({
    game_id: "",
    user: {
      token: "",
      id: "",
      name: "",
    },
    players: [],
  });

  const connect = () => {
    onMount(async () => {
      const { io } = await import("socket.io-client");
      const sock = io(url);
      sock.on("connect", () => {
        sock.on("update", (p) => {
          gameInfo.update((g) => {
            g.players = p;
            return g;
          });
        });

        sock.on("created", ({ game_id, admin }) => {
          gameInfo.update((g) => {
            g.game_id = game_id;
            g.user = admin;
            return g;
          });
        });

        sock.on("joined", (user) => {
          gameInfo.update((g) => {
            g.user = user;
            return g;
          });
        });

        sock.on("buzzered", (res) => {
          alert(JSON.stringify(res));
        });

        socket = Promise.resolve(sock);
      });
    });
  };

  const join = async (game_id, name) => {
    const sock = await socket;
    sock.emit("join", { username: name, game_id });
    gameInfo.update((g) => {
      g.game_id = game_id;
      return g;
    });
  };

  const create = async () => {
    const sock = await socket;
    sock.emit("create");
  };

  const buzzer = async () => {
    const sock = await socket;
    gameInfo.update((g) => {
      sock.emit("buzzer", { game_id: g.game_id, user_token: g.user.token });
      return g;
    });
  };

  const reply = async (method) => {
    const sock = await socket;
    gameInfo.update((g) => {
      sock.emit("reply", {
        game_id: g.game_id,
        admin_token: g.user.token,
        method,
      });
      return g;
    });
  };

  return {
    connect,
    join,
    create,
    buzzer,
    reply,
    subscribe: gameInfo.subscribe,
  };
};

export const game = createGame();
