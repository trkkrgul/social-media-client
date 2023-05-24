import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feed: false,
  profilePosts: false,
  followingPosts: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setFeedPosts(state, action) {
      state.feed = action.payload;
    },
    setFollowingPosts(state, action) {
      state.followingPosts = action.payload;
    },
    setProfilePosts(state, action) {
      state.profilePosts = action.payload;
    },
  },
});

export const { setFeedPosts, setFollowingPosts, setProfilePosts } =
  postSlice.actions;

export default postSlice.reducer;
