import {
  setNonce,
  setSessionEnd,
  setSignOut,
  setSignature,
  setToken,
  setUser,
  setWalletAddress,
} from "@/state/slices/auth";
import {
  Box,
  ButtonGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import {
  Button,
  Stepper,
  StepperCompleted,
  StepperStep,
  useModals,
} from "@saas-ui/react";
import axios from "axios";
import { ConnectKitButton } from "connectkit";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useSigner } from "wagmi";
import CreateProfileModal from "../modals/createProfile";
import { useRouter } from "next/router";

const LoginStepper = () => {
  const { data: signer } = useSigner();
  const [step, setStep] = useState(0);
  const modals = useModals();

  const back = () => {
    setStep(step - 1);
  };

  const next = () => {
    setStep(step + 1);
  };
  const router = useRouter();
  const walletAddress = useSelector((state) => state.auth.walletAddress);
  const token = useSelector((state) => state.auth.token);
  const nonce = useSelector((state) => state.auth.nonce);
  const signature = useSelector((state) => state.auth.signature);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { address, connector, isReconnected, isConnected } = useAccount({
    onDisconnect() {
      console.log("Disconnected");
      dispatch(setWalletAddress(false));
      dispatch(setSignOut());
    },
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
      if (!isReconnected) {
        dispatch(setToken(false));
      }
      dispatch(setWalletAddress(address));
    },
  });
  const authenticateUser = async () => {
    try {
      await axios
        .post("https://api.defitalks.io/api/auth/nonce", {
          walletAddress: walletAddress,
        })
        .then(async (res) => {
          if (res.status === 200) {
            dispatch(setNonce(res.data.nonce));
            signer.signMessage(`${res.data.nonce}`).then(async (_signature) => {
              console.log(_signature);
              dispatch(setSignature(_signature));
              await axios
                .post("https://api.defitalks.io/api/auth/checkSignature", {
                  signature: _signature,
                  walletAddress: walletAddress,
                })
                .then(async (res) => {
                  if (res.status === 200) {
                    dispatch(setToken(res.data.token));
                    dispatch(setSessionEnd(false));
                    await axios
                      .get("https://api.defitalks.io/api/auth/profile", {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${res.data.token}`,
                        },
                      })
                      .then((res) => {
                        if (res.status === 200) {
                          dispatch(setUser(res.data));
                        }
                      })
                      .catch((err) => {
                        if (err.response.status === 403) {
                          dispatch(setToken(false));
                          dispatch(setSessionEnd(true));
                        }
                      });
                  }
                })
                .catch((err) => {
                  if (err.response.status === 401) {
                    dispatch(setSignOut());
                    dispatch(setWalletAddress(false));
                    setStep(0);
                  }
                });
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      border={"1px solid"}
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      borderRadius={"md"}
      m={4}
      p={4}
    >
      <Tabs
        colorScheme="primary"
        index={step}
        onChange={(index) => {
          setStep(index);
        }}
      >
        <TabList>
          <Tab>
            <Text>Web3 Connection</Text>
          </Tab>
          <Tab isDisabled={step < 1}>Authenticate</Tab>
          <Tab isDisabled={step < 2}>Create Profile</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <>
              <Box py="4">
                <Text>Connect your wallet.</Text>
                <ConnectKitButton mode="dark" />
              </Box>

              {!!isConnected && !!address && walletAddress === address && (
                <ButtonGroup>
                  <Button
                    label="Next"
                    onClick={next}
                    isDisabled={step >= 3}
                    colorScheme="primary"
                  />
                </ButtonGroup>
              )}
            </>
          </TabPanel>
          <TabPanel>
            <>
              <Box py="4"> Authenticate with your signature.</Box>
              <ButtonGroup>
                {!!isConnected &&
                !!address &&
                walletAddress === address &&
                !!nonce &&
                !!token &&
                !!signature ? (
                  <Button
                    label="Next"
                    onClick={() => setStep((prev) => prev + 1)}
                    isDisabled={step >= 3}
                    colorScheme="primary"
                  />
                ) : (
                  <Button
                    label="Authenticate"
                    onClick={authenticateUser}
                    isDisabled={step >= 3}
                    colorScheme="primary"
                  />
                )}
                <Button
                  label="Back"
                  onClick={() => setStep((prev) => prev - 1)}
                  isDisabled={step === 0}
                  variant="ghost"
                />
              </ButtonGroup>
            </>
          </TabPanel>
          <TabPanel>
            {!!isConnected &&
            !!nonce &&
            !!token &&
            !!signature &&
            !user.isProfileCreated ? (
              <CreateProfileModal />
            ) : (
              <>
                <Text>You are ready to use the app.</Text>
                <Button onClick={() => router.push("/")}>Login</Button>
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default LoginStepper;
