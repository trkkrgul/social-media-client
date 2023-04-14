import React from "react";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectKitButton } from "connectkit";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNonce, setSignature, setWalletAddress } from "@/state/slices/auth";
const ConnectButton = () => {
  //   const dispatch = useDispatch();
  //   const nonce = useSelector((state) => state.auth.nonce);
  //   const signature = useSelector((state) => state.auth.signature);
  //   const walletAddress = useSelector((state) => state.auth.walletAddress);
  //   const isProfileCreated = useSelector((state) => state.auth.isProfileCreated);
  //   const getTokenFromSignature = async (signature, walletAddress) => {
  //     await axios
  //       .post("http://localhost:5001/api/auth/checkSignature", {
  //         signature: signature,
  //         walletAddress,
  //       })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           console.log(res.data);
  //           dispatch(setToken(res.data.token));
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  //   const { data, isError, isLoading, isSuccess, signMessageAsync } =
  //     useSignMessage({
  //       nonce: Number(nonce),
  //       message: String(nonce),
  //       onSuccess: (data) => {
  //         dispatch(setSignature(data));
  //         console.log("Signed message", data);
  //         getTokenFromSignature(data, walletAddress);
  //       },
  //     });

  //   const account = useAccount({
  //     onConnect({ address, connector, isReconnected }) {
  //       console.log("Connected", { address, connector, isReconnected });
  //       dispatch(setWalletAddress(address));
  //       if (!isReconnected) {
  //         getNonce(address);
  //         signMessageAsync();
  //       }
  //     },
  //   });

  //   const getNonce = async (walletAddress) => {
  //     await axios
  //       .post("http://localhost:5001/api/auth/nonce", {
  //         walletAddress: walletAddress,
  //       })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           console.log(res.data);
  //           dispatch(setNonce(res.data.nonce));
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  return <>asda</>;
};

export default ConnectButton;
