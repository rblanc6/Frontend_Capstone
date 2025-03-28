import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:3000/api",
    baseUrl: "https://racipe-hub.onrender.com/api",
  }),
  tagTypes: ["User, Recipe, FavoriteRecipes, Review, Comment"],
  endpoints: () => ({}),
});
