import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark",
  isAuth: false,
  signature: false,
  walletAddress: false,
  isProfileCreated: false,
  token: false,
  user: false,
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
  },
});

export const {
  setUser,
  setTheme,
  setNonce,
  setIsProfileCreated,
  setSignature,
  setWalletAddress,
  setToken,
} = authSlice.actions;

export default authSlice.reducer;
