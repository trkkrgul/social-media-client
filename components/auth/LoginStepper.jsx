import {
  setNonce,
  setSignature,
  setToken,
  setUser,
  setWalletAddress,
} from "@/state/slices/auth";
import { Box, ButtonGroup, Text } from "@chakra-ui/react";
import {
  Button,
  Stepper,
  StepperCompleted,
  StepperStep,
  useModals,
} from "@saas-ui/react";
import axios from "axios";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useSignMessage, useSigner } from "wagmi";
import CreateProfileModal from "../modals/createProfile";

const LoginStepper = () => {
  const { data: signer } = useSigner();
  const [step, setStep] = React.useState(0);
  const modals = useModals();

  const back = () => {
    setStep(step - 1);
  };

  const next = () => {
    setStep(step + 1);
  };

  const walletAddress = useSelector((state) => state.auth.walletAddress);
  const isProfileCreated = useSelector((state) => state.auth.isProfileCreated);
  const token = useSelector((state) => state.auth.token);
  const nonce = useSelector((state) => state.auth.nonce);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const signature = useSelector((state) => state.auth.signature);
  const dispatch = useDispatch();
  const router = useRouter();
  const { address, connector, isReconnected, isConnected } = useAccount({
    onDisconnect() {
      console.log("Disconnected");
      dispatch(setWalletAddress(false));
    },
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
      dispatch(setWalletAddress(address));
    },
  });
  const authenticateUser = async () => {
    try {
      await axios
        .post("http://localhost:5001/api/auth/nonce", {
          walletAddress: walletAddress,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log(res.data);
            dispatch(setNonce(res.data.nonce));
            signer.signMessage(`${res.data.nonce}`).then(async (_signature) => {
              console.log(_signature);
              dispatch(setSignature(_signature));
              await axios
                .post("http://localhost:5001/api/auth/checkSignature", {
                  signature: _signature,
                  walletAddress: walletAddress,
                })
                .then(async (res) => {
                  if (res.status === 200) {
                    console.log(res.data);
                    dispatch(setToken(res.data.token));
                    await axios
                      .get("http://localhost:5001/api/auth/profile", {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${res.data.token}`,
                        },
                      })
                      .then((res) => {
                        if (res.status === 200) {
                          console.log(res.data);
                          dispatch(setUser(res.data));
                        }
                      });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const steps = [
    {
      name: "step 1",
      title: "First step",
      children: (
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
      ),
    },
    {
      name: "step 2",
      title: "Second step",
      children: (
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
                onClick={next}
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
              onClick={back}
              isDisabled={step === 0}
              variant="ghost"
            />
          </ButtonGroup>
        </>
      ),
    },
    {
      name: "step 3",
      title: "Third step",
      children: (
        <>
          <CreateProfileModal />
          <ButtonGroup>
            <Button
              label="Create Profile"
              onClick={() => {
                router.push("/profile/create");
              }}
              isDisabled={step >= 3}
            />
            <Button
              label="Back"
              onClick={back}
              isDisabled={step === 0}
              variant="ghost"
            />
          </ButtonGroup>
        </>
      ),
    },
  ];

  return (
    <>
      <Stepper step={step} mb="2" orientation="vertical">
        {steps.map((args, i) => (
          <StepperStep key={i} {...args} />
        ))}
        <StepperCompleted py="4">Completed</StepperCompleted>
      </Stepper>
    </>
  );
};

export default LoginStepper;
