import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

const initialState = {
  show: true
};

const store = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoader: (state, {payload}) => {
      state.show = payload.show;
    }
  }
});

export const { setLoader } = store.actions;
export const getLoader = (state: RootState) => state.loader;
export default store.reducer;
