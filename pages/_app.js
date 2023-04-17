import "@/styles/globals.css";
import Providers from "./Providers";
import { store } from "@/state";
import SessionEnd from "@/components/toasts/SessionEnd";

export default function App({ Component, pageProps }) {
  return (
    <Providers store={store}>
      <SessionEnd />
      <Component {...pageProps} />
    </Providers>
  );
}
