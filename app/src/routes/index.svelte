<script>
  import Counter from "$lib/Counter.svelte";
  import { game } from "$lib/game";

  game.connect();

  let id = "";
  let name = "";

  const create_game = async () => {
    game.create();
  };

  const join_game = async () => {
    game.join(id, name);
  };
</script>

<main>
  <h1>Hello world!</h1>

  <button on:click={create_game}>Create</button>

  <hr />

  <input type="text" placeholder="Id" bind:value={id} />
  <input type="text" placeholder="Name" bind:value={name} />

  <button on:click={join_game}>Join</button>

  <hr />

  <p>Game Info</p>
  <ul>
    <li>Game id: {$game.game_id}</li>
    <li>
      <ul>
        <li>User id: {$game.user.id}</li>
        <li>Username: {$game.user.name}</li>
        <li>User token: {$game.user.token}</li>
      </ul>
    </li>
  </ul>

  <hr />

  <button on:click={() => game.buzzer()}>Buzzer</button>
  <button on:click={() => game.reply("+1")}>Buzzer</button>

  <hr />

  <p>Players</p>
  <ul>
    {#each $game.players as player}
      <li>{player.score} | {player.name} | {player.id}</li>
    {/each}
  </ul>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 4rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 2rem auto;
    line-height: 1.35;
  }

  ul {
    text-align: left;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
