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
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;