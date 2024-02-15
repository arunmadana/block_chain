import { createSlice } from "@reduxjs/toolkit";

const loginDetailsSlice = createSlice({
  name: "Login-Details",
  initialState: {
    requestToken: "",
    isPwdExpired: "",
    jwtToken: "",
    authorities: {},
  },
  reducers: {
    storeLoginDetails: (state, { payload }) => {
      state.isPwdExpired = payload.isPwdExpired;
      state.requestToken = payload.requestToken;
      state.jwtToken = payload.jwtToken;
      state.authorities = payload.authorities;
    },
  },
});

export const { storeLoginDetails } = loginDetailsSlice.actions;
export default loginDetailsSlice.reducer;
