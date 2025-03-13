import { api } from "../../app/api";

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/admin/users",
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data.users,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["User"],
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `/admin/user/${id}`,
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["User"],
    }),

    updateUserAdmin: builder.mutation({
      query: ({ id, firstName, lastName, email, role }) => ({
        url: `/admin/user/${id}`,
        method: "PUT",
        body: JSON.stringify({ firstName, lastName, email, role }),
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/user/${id}`,
        method: "DELETE",
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

    updateRecipeAsAdmin: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/admin/recipe/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),

        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      invalidatesTags: ["Recipe"],
    }),

    deleteRecipeAsAdmin: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/recipe/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data.recipes,
        transformErrorResponse: (response) => response.data.error,
      }),
      invalidatesTags: ["Recipe"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserAdminMutation,
  useDeleteUserMutation,
  useUpdateRecipeAsAdminMutation,
  useDeleteRecipeAsAdminMutation,
} = usersApi;
