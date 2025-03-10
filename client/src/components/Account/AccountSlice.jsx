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

    getReviews: builder.query({
      query: ({id}) => ({
        url: `/reviews/user/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Review"],
    }),

    getComments: builder.query({
      query: ({id}) => ({
        url: `/comments/user/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Comment"],
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



export const { useGetUserQuery, useUpdateUserMutation, useGetReviewsQuery, useGetCommentsQuery } = userDetailsApi;