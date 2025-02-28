import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: window.sessionStorage.getItem("token") ? true : false,
  user: null,
};

export const confirmLoginSlice = createSlice({
  name: "confirmLogin",
  initialState,
  reducers: {
    confirmLogin: (state, action) => {
      state.value = true;
      state.user = action.payload;
    },
    confirmLogout: (state) => {
      state.value = false;
      state.user = null;
    },
  },
});

export const { confirmLogin, confirmLogout } = confirmLoginSlice.actions;
export const getLogin = (state) => state.confirmLogin.value;
export default confirmLoginSlice.reducer;
