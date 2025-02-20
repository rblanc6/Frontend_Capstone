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
  }),
});

export const { useGetRecipeQuery} = recipeDetailsApi;