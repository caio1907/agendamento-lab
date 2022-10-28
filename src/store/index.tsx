import { configureStore } from "@reduxjs/toolkit";
import LoaderReducer from "./Loader.store";

const store = configureStore({
  reducer: {
    loader: LoaderReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export default store;
