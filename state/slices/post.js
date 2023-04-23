import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feed: false,
  profilePosts: [{ wallet: "231", posts: [] }],
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

    addProfilePosts(state, action) {
      state.profilePosts.push(action.payload);
    },
  },
});

export const { setFeedPosts, addProfilePosts, setFollowingPosts } =
  postSlice.actions;

export default postSlice.reducer;
