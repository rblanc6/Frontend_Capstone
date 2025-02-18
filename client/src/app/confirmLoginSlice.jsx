import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: window.sessionStorage.getItem("token") ? true : false,
};

export const confirmLoginSlice = createSlice({
  name: "confirmLogin",
  initialState,
  reducers: {
    confirmLogin: (state) => {
      state.value = true;
    },
    confirmLogout: (state) => {
      state.value = false;
    },
  },
});

export const { confirmLogin, confirmLogout } = confirmLoginSlice.actions;
export const getLogin = (state) => state.confirmLogin.value;
export default confirmLoginSlice.reducer;
