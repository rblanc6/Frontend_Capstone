import { api } from "../../app/api";

const userDetailsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: ({ id, firstName, lastName, email, role }) => ({
        url: `/auth/user/${id}`,
        method: "PUT",
        body: JSON.stringify({ firstName, lastName, email, role }),
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data.users,
        transformErrorResponse: (response) => response.data.error,
      }),

      invalidatesTags: ["User"],
    }),
  }),
});



export const { useGetUserQuery, useUpdateUserMutation } = userDetailsApi;