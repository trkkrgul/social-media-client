import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark",
  isAuth: false,
  signature: false,
  nonce: false,
  walletAddress: false,
  isProfileCreated: false,
  token: false,
  user: false,
  sessionEnd: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setNonce(state, action) {
      state.nonce = action.payload;
    },
    setSignature(state, action) {
      state.signature = action.payload;
    },
    setWalletAddress(state, action) {
      state.walletAddress = action.payload;
    },
    setIsProfileCreated(state, action) {
      state.isProfileCreated = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setSessionEnd(state, action) {
      state.sessionEnd = action.payload;
    },
    setSignOut(state, action) {
      state.isAuth = false;
      state.signature = false;
      state.walletAddress = false;
      state.isProfileCreated = false;
      state.token = false;
      state.user = false;
      state.nonce = false;
    },
  },
});

export const {
  setUser,
  setTheme,
  setNonce,
  setIsProfileCreated,
  setSessionEnd,
  setSignature,
  setWalletAddress,
  setSignOut,
  setToken,
} = authSlice.actions;

export default authSlice.reducer;
