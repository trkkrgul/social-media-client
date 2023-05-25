import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = userSlice.actions;

export default userSlice.reducer;
