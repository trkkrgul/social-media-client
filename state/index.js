import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authSlice } from "./slices/auth";
import { postSlice } from "./slices/post";
import { userSlice } from "./slices/users";
import { storySlice } from "./slices/story";
const persistConfig = { key: "root", storage, version: 2 };
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    [authSlice.name]: authSlice.reducer,
    [postSlice.name]: postSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [storySlice.name]: storySlice.reducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
