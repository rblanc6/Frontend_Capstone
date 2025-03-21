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
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),

      invalidatesTags: ["User"],
    }),
  }),
});

const storeUserAndToken = (state, { payload }) => {
  window.sessionStorage.setItem("token", payload.token);
  window.sessionStorage.setItem("user", JSON.stringify(payload.user)); 
};

const registerSlice = createSlice({
  name: "register",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.register.matchFulfilled, storeUserAndToken);
  },
});

export default registerSlice.reducer;

export const { useRegisterMutation } = registerApi;
