<script>
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    ButtonGroup,
    Button,
  } from "sveltestrap";

  let isOpen = false;
  const toggle = () => (isOpen = !isOpen);
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  />

  <title>Guess</title>
</svelte:head>

<header>
  <Navbar color="dark" dark>
    <NavbarBrand href="/">GUESS</NavbarBrand>

    <ButtonGroup>
      <a href="/game/join">
        <Button color="primary">Join Game</Button>
      </a>
      <a href="/game/create">
        <Button color="success">Create</Button>
      </a>
    </ButtonGroup>

    <NavbarToggler on:click={toggle} className="mr-2" />
    <Collapse {isOpen} navbar>
      <Nav navbar>
        <NavItem>
          <NavLink href="/about">About</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="https://github.com/thorge2/guess" target="_blank"
            >GitHub</NavLink
          >
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>
</header>

<main>
  <slot />
</main>
