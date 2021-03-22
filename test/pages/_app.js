import Link from "next/link";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">Create</Link>
            </li>
            <li>
              <Link href="/join">Join</Link>
            </li>
          </ul>
        </nav>
      </header>

      <hr />

      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
