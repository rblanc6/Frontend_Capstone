// import { useEffect, useState } from "react";
import {
  useGetRecipeQuery,
  useGetInstructionsQuery,
  useGetIngredientsQuery,
  useGetCategoriesQuery,
} from "./SingleRecipeSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useAddFavoriteRecipeMutation } from "../Recipes/RecipesSlice";

export default function SingleRecipe() {
  const { id } = useParams();
  const { data: recipe } = useGetRecipeQuery(id);
  const { data: instructions } = useGetInstructionsQuery(id);
  const { data: ingredients } = useGetIngredientsQuery(id);
  const { data: categories } = useGetCategoriesQuery(id);
  const navigate = useNavigate();
  const [favoriteRecipe] = useAddFavoriteRecipeMutation();

  const handleFavorite = async (event) => {
    event.preventDefault();
    try {
      await favoriteRecipe({
        id,
        favorite: !recipe.favorite,
      });
    } catch (error) {
      console.error("Error during making it your favorite recipe", error);
    }
  };

  const returnToList = () => {
    navigate("/recipes");
  };

  const { name, description, photo, favorite } = recipe;
  return (
    <>
      <div>
        <div>
          <h4>{name}</h4>
          <p>{description}</p>
          <h4>{ingredients}</h4>
          <ul>
            {ingredients &&
              ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
          </ul>
          <h4>{instructions}</h4>
          <ul>
            {instructions &&
              instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
          </ul>
          <h4>{categories}</h4>
          <ul>
            {categories &&
              categories.map((category, index) => (
                <li key={index}>{category}</li>
              ))}
          </ul>
          <p>Favorite: {favorite ? "💖" : "💔"}</p>
          <p>
            {sessionStorage.getItem("token") && (
              <button onClick={handleFavorite}>
                {favorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            )}
          </p>
        </div>
        <div>
          <img src={photo} alt={name} />
        </div>
      </div>
      <br />
      <div>
        <button onClick={returnToList}>Return to Recipes List</button>
      </div>
    </>
  );
}
