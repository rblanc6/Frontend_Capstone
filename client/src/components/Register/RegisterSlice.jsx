import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../app/api";

const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ firstName, lastName, email, password }) => ({
        url: "/auth/register",
        mode: "cors",
        method: "POST",
        body: {
          firstName,
          lastName,
          email,
          password,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

const storeToken = (state, { payload }) => {
    window.sessionStorage.setItem("token", payload.token);
  // window.localStorage.setItem("token", payload.token);
};

const registerSlice = createSlice({
  name: "register",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.register.matchFulfilled, storeToken);
  },
});

export default registerSlice.reducer;

export const { useRegisterMutation } = registerApi;
