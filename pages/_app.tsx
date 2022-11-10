import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<"" | "light" | "dark">("");
  const router = useRouter();
  useEffect(() => {
    const cookie = parseCookies();
    setTheme(cookie.theme === "dark" ? "dark" : "light");
  }, []);

  const changeTheme = () => {
    const cookie = parseCookies();
    setCookie(null, "theme", cookie.theme === "dark" ? "light" : "dark", {
      maxAge: 60 * 60 * 24 * 30 * 12 * 1,
      path: "/"
    });
    router.reload();
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=800" />
        <title>プリコネタワー</title>
      </Head>
      <div className="content pt-1">
        <header className="container">
          <div className={`text-end mb-3 ${theme === "" ? "invisible" : "visible"}`}>
            <span className="link" onClick={changeTheme}>ダークモード: { theme === "light" ? "オフ" : "オン" }</span>
          </div>
          <p className="fs-1 text-center">プリコネタワー</p>
        </header>
        <Component {...pageProps} />
        <footer>
          <div className="text-center pt-3 pb-3">
            <div>
              <a href="https://twitter.com/@JADENgygo" className="me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://priconne-portfolio.vercel.app" className="link">
                闇プリン開発室
              </a>
            </div>
            <div>画像 &copy; Cygames, Inc.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
