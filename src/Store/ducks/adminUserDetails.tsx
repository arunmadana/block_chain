import { createSlice } from "@reduxjs/toolkit";
import {
  profileInformation,
  userInfoApi,
} from "../../services/ProfileInformation/ProfileInformation";

const userDetailsSlice = createSlice({
  name: "User-Details",
  initialState: {
    isLoading: false,
    data: {},
    isError: false,
    errorMessage: "",
    lastFetched: null,
  },

  reducers: {
    fetchUserDetailLoading: (state) => {
      state.isLoading = true;
    },
    fetchUserDetailsSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.lastFetched = new Date();
      state.data = { ...state.data, ...payload.data };
    },
    storeUserDetails: (state, { payload }) => {
      state.data = { ...state.data, ...payload };
    },
    fetchUserDetailsFailure: (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload.error;
    },
  },
});

export const {
  fetchUserDetailLoading,
  fetchUserDetailsSuccess,
  fetchUserDetailsFailure,
  storeUserDetails,
} = userDetailsSlice.actions;

export const fetchUserDetailsAction = () => (dispatch: any) => {
  // const userId = getStorage('userIdLogin');
  dispatch(fetchUserDetailLoading());
  profileInformation()
    .then((res) => {
      const { data } = res.data;
      dispatch(fetchUserDetailsSuccess({ data }));
      //
    })
    .catch((err) => {
      const message =
        err?.response?.data?.error?.errorDescription ||
        "Unable to get the User Details";
      dispatch(fetchUserDetailsFailure({ error: message }));
    });

  userInfoApi({})
    .then((res) => {
      const { data } = res.data;
      dispatch(fetchUserDetailsSuccess({ data }));
    })
    .catch((err) => {
      const message =
        err?.response?.data?.error?.errorDescription ||
        "Unable to get the User Details";
      dispatch(fetchUserDetailsFailure({ error: message }));
    });
};

export default userDetailsSlice.reducer;
