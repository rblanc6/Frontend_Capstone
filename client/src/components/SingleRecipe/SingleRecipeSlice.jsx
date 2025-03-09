import { api } from "../../app/api";

const recipeDetailsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecipe: builder.query({
      query: (id) => ({
        url: `/recipes/recipe/${id}`,
        method: "GET",
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),

    postReview: builder.mutation({
      query: (review) => ({
        url: "/reviews/review",
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body: review,
      }),
      invalidatesTags: ["Review"],
    }),

    postComment: builder.mutation({
      query: (comment) => ({
        url: "/comments/comment",
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body: comment,
      }),
      invalidatesTags: ["Comment"],
    }),

    getReview: builder.query({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "GET",
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Review"],
    }),

    editReview: builder.mutation({
      query: ({ id, body }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body,

        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),

      invalidatesTags: ["Review"],
    }),

    deleteReview: builder.mutation({
      query: ({ id }) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data.recipes,
        transformErrorResponse: (response) => response.data.error,
      }),
      invalidatesTags: ["Review"],
    }),
    
  }),
});



export const {
  useGetRecipeQuery,
  usePostReviewMutation,
  usePostCommentMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
  useGetReviewQuery
} = recipeDetailsApi;
