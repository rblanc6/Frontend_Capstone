import { useEffect, useState } from "react";
import { useGetRecipeQuery } from "./SingleRecipeSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useAddFavoriteRecipeMutation } from "../Recipes/RecipesSlice";

export default function SingleRecipe() {
  const { id } = useParams();
  const { data, isSuccess, error } = useGetRecipeQuery(id);
  const navigate = useNavigate();
  const [favoriteRecipe] = useAddFavoriteRecipeMutation();

  const [singleRecipe, setSingleRecipe] = useState({});

  useEffect(() => {
    if (isSuccess) {
      setSingleRecipe(data);
    }
  }, [data]);

  async function handleFavorite(event) {
    event.preventDefault();
    try {
      const result = await favoriteRecipe({
        id,
        favorite: false,
      });
    } catch (error) {
      console.error("Error during making it your favorite recipe", error);
    }
  }

  const returnToList = () => {
    navigate("/recipes");
  };
  return (
    <>
      <div>
        <div>
          <h3>{singleRecipe.name}</h3>
          <h5>{singleRecipe.categories}</h5>
          <p>{singleRecipe.description}</p>
          <p>{singleRecipe.instructions}</p>
          {/* <p>{singleRecipe.ingredients}</p> */}
          <p>Favorite: {singleRecipe.favorite ? "💖" : "💔"}</p>
          <p>
            {sessionStorage.getItem("token") && singleRecipe.favorite ? (
              <button onClick={handleFavorite}>
                Favorite
              </button>
            ) : (
              ""
            )}
          </p>
        </div>
        <div>
          <img src={singleRecipe.photo} alt={singleRecipe.name} />
        </div>
      </div>
      <div>
        <button onClick={returnToList}>
          Return to Recipes List
        </button>
      </div>
    </>
  );
}
