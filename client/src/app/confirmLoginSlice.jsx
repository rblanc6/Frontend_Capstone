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
      console.log('User logged in:', action.payload);
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
export const getUser = (state) => state.confirmLogin.user;
export default confirmLoginSlice.reducer;
