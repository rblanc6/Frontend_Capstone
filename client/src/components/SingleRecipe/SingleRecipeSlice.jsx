import { api } from "../../app/api";

const recipeDetailsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecipe: builder.query({
      query: (id) => ({
        url: `/recipes/${id}`,
        method: "GET",
        transformResponse: (response) => response.data.recipe,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),

    getInstructions: builder.query({
      query: (id) => ({
        url: `/instructions/${id}`,
        method: "GET",
        transformResponse: (response) => response.data.instructions,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),

    getIngredients: builder.query({
      query: (id) => ({
        url: `/ingredients/${id}`,
        method: "GET",
        transformResponse: (response) => response.data.recipeIngredient,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),

    getCategories: builder.query({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
        transformResponse: (response) => response.data.categories,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),
  }),
});

export const {
  useGetRecipeQuery,
  useGetInstructionsQuery,
  useGetIngredientsQuery,
  useGetCategoriesQuery,
} = recipeDetailsApi;
