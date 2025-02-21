import { api } from "../../app/api";

const recipeDetailsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecipe: builder.query({
      query: (id) => ({
        url: `/recipes/${id}`,
        method: "GET",
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),

    // getInstructions: builder.query({
    //   query: (id) => ({
    //     url: `/recipes/${id}/instructions`,
    //     mode: "no-cors",
    //     method: "GET",
    //     transformResponse: (response) => response.instruction,
    //     transformErrorResponse: (response) => response.data.error,
    //   }),
    //   providesTags: ["Recipe"],
    // }),

    // getIngredients: builder.query({
    //   query: (id) => ({
    //     url: `/recipes/${id}/ingredients`,
    //     mode: "no-cors",
    //     method: "GET",
    //     transformResponse: (response) => response.ingredient,
    //     transformErrorResponse: (response) => response.data.error,
    //   }),
    //   providesTags: ["Recipe"],
    // }),

    // getCategories: builder.query({
    //   query: (id) => ({
    //     url: `/recipes/${id}/categories`,
    //     mode: "no-cors",
    //     method: "GET",
    //     transformResponse: (response) => response.categories,
    //     transformErrorResponse: (response) => response.data.error,
    //   }),
    //   providesTags: ["Recipe"],
    // }),
  }),
});

export const { useGetRecipeQuery } = recipeDetailsApi;
