import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feed: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setFeedPosts(state, action) {
      state.feed = action.payload;
    },
  },
});

export const { setFeedPosts } = postSlice.actions;

export default postSlice.reducer;
