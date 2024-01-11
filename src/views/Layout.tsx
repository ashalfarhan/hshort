import { FC } from 'hono/jsx';

export const Layout: FC = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="A Free URL Shortener App" />
        <meta
          name="keywords"
          content="url, urlshortener, free, open source, nodejs, ashalfarhan"
        />
        <meta name="author" content="Ashal Farhan" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="./apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="./favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="./favicon-16x16.png"
        />
        <link rel="manifest" href="./site.webmanifest" />
        <link href="./styles.css" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.12.0/dist/cdn.min.js"
        ></script>
        <title>hshort</title>
      </head>
      <body>
        <header>
          <h1>hshort.me</h1>
        </header>
        <main>
          {children}
          <footer>
            Develeoped by&nbsp;
            <a
              href="https://github.com/ashalfarhan"
              target="_blank"
              rel="noopener"
            >
              Ashal Farhan
            </a>
          </footer>
        </main>
      </body>
    </html>
  );
};
