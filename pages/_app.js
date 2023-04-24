import "@/styles/globals.css";
import Providers from "./Providers";
import { store } from "@/state";
import SessionEnd from "@/components/toasts/SessionEnd";
import { Roboto, Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin-ext"],
});

export default function App({ Component, pageProps }) {
  return (
    <Providers store={store}>
      <SessionEnd />
      <main className={rubik.className}>
        <Component {...pageProps} />
      </main>
    </Providers>
  );
}
