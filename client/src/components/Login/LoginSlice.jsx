import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../app/api";

const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        mode: "cors",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

const storeToken = (state, { payload }) => {
  window.localStorage.setItem("token", payload);
  //   window.sessionStorage.setItem("token", payload);
};

const loginSlice = createSlice({
  name: "login",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, storeToken);
  },
});

export default loginSlice.reducer;

export const { useLoginMutation } = loginApi;
