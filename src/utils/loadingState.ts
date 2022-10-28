import store from "../store";
import { setLoader } from "../store/Loader.store";

export const setLoading = (show:boolean) => {
  store.dispatch(setLoader({show}))
}

export const getLoading = () => {
  return store.getState().loader.show;
}
