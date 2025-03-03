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

    
  }),
});



export const {
  useGetRecipeQuery,
  usePostReviewMutation,
  usePostCommentMutation,
} = recipeDetailsApi;
