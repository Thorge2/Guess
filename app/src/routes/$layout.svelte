<header>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a class="navbar-brand" href="/">GUESS</a>

    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="/"
            >Home
            <span class="sr-only">(current)</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/about">About</a>
        </li>
      </ul>
      <div class="btn-group">
        <a href="/player"
          ><button class="btn btn-warning btn-lg">Join</button></a
        >
        <a href="/admin"><button class="btn btn-info btn-lg">Create</button></a>
      </div>
    </div>
  </nav>
</header>

<main>
  <div class="container">
    <slot />
  </div>
</main>

<footer />
