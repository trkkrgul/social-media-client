import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stories: [],
  isStoriesActive: false,
  storyIndex: 0,
};

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setStories(state, action) {
      state.stories = action.payload;
    },
    setIsStoriesActive(state, action) {
      state.isStoriesActive = action.payload;
    },
    setStoryIndex(state, action) {
      state.storyIndex = action.payload;
    },
  },
});

export const { setStories, setIsStoriesActive, setStoryIndex } =
  storySlice.actions;

export default storySlice.reducer;
