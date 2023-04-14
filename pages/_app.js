import "@/styles/globals.css";
import Providers from "./Providers";
import { store } from "@/state";

export default function App({ Component, pageProps }) {
  return (
    <Providers store={store}>
      <Component {...pageProps} />
    </Providers>
  );
}
