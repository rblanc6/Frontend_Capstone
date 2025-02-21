import { useEffect, useState } from "react";
import { useGetRecipeQuery } from "./SingleRecipeSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAddFavoriteRecipeMutation,
  useDeleteFavoriteRecipeMutation,
} from "../Recipes/RecipesSlice";

export default function SingleRecipe() {
  const { id } = useParams();
  const { data, isSuccess } = useGetRecipeQuery(id);
  const navigate = useNavigate();
  const [favoriteRecipe] = useAddFavoriteRecipeMutation();
  const [deleteFavoriteRecipe] = useDeleteFavoriteRecipeMutation();
  const [isFavorite, setIsFavorite] = useState(
    JSON.parse(sessionStorage.getItem(`favorite-${id}`)) ||
      data?.favorite ||
      false
  );

  console.log(data);

  const handleFavorite = async (event) => {
    event.preventDefault();
    try {
      if (isFavorite) {
        await deleteFavoriteRecipe({ id }).unwrap();
        setIsFavorite(false);
        sessionStorage.setItem(`favorite-${id}`, false);
      } else {
        await favoriteRecipe({
          recipeId: id,
          favorite: true,
        }).unwrap();
        setIsFavorite(true);
        sessionStorage.setItem(`favorite-${id}`, true);
      }
    } catch (error) {
      console.error("Error adding favorite recipe", error);
    }
  };
  console.log(favoriteRecipe);

  const [recipeArr, setRecipeArr] = useState([]);
  useEffect(() => {
    if (isSuccess) {
      setRecipeArr(data);
    }
  }, [data, isSuccess]);

  const returnToList = () => {
    navigate("/recipes");
  };

  return (
    <>
      <div>
        <div>
          <img src={recipeArr.photo} alt={recipeArr.name} />
        </div>
        <h4>{recipeArr.name}</h4>
        <p>{recipeArr.description}</p>

        <h4>Ingredients</h4>
        <ul>
          {recipeArr?.ingredient?.map((ing) => {
            return (
              <li key={ing.id}>
                {ing.quantity} {ing.unit.name} of {ing.ingredient.name}{" "}
              </li>
            );
          })}
        </ul>
        <h4>Instructions</h4>
        <ul>
          {recipeArr?.instructions?.map((inst) => {
            return <li key={inst.id}> {inst.instruction}</li>;
          })}
        </ul>
        <h4>Categories</h4>
        <ul>
          {recipeArr?.categories?.map((cat) => {
            return <li key={cat.id}> {cat.name}</li>;
          })}
        </ul>

        <p>
          {sessionStorage.getItem("token") && (
            <button onClick={handleFavorite}>
              {" "}
              <span>
                Favorite:{" "}
                {isFavorite ? (
                  <i className="bi bi-heart-fill" style={{ color: "red" }}></i>
                ) : (
                  <i className="bi bi-heart"></i>
                )}
              </span>
            </button>
          )}
        </p>
      </div>
      <br />
      <div>
        <button onClick={returnToList}>Return to Recipes List</button>
      </div>
    </>
  );
}
