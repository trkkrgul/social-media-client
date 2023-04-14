import { Provider } from "react-redux";
import { client } from "utils/wagmi";
import { WagmiConfig } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { ModalsProvider, SaasProvider } from "@saas-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/theme";
import { CacheProvider } from "@emotion/react";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import SidebarWidget from "@/views/Sidebar";

const Providers = ({ store, children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <WagmiConfig client={client}>
          <SaasProvider theme={theme}>
            <ConnectKitProvider debugMode>
              <ModalsProvider>
                <SidebarWidget>{children}</SidebarWidget>
              </ModalsProvider>
            </ConnectKitProvider>
          </SaasProvider>
        </WagmiConfig>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
