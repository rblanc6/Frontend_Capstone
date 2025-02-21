import { useEffect, useState } from "react";
import { useGetRecipeQuery } from "./SingleRecipeSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useAddFavoriteRecipeMutation } from "../Recipes/RecipesSlice";

export default function SingleRecipe() {
  const { id } = useParams();
  const { data, isSuccess } = useGetRecipeQuery(id);
  const navigate = useNavigate();
  const [favoriteRecipe] = useAddFavoriteRecipeMutation();
  const [isFavorite, setIsFavorite] = useState(data?.favorite || false);
console.log(data)
  const handleFavorite = async (event) => {
    event.preventDefault();
    try {
      await favoriteRecipe({
        recipeId: id,
        favorite: !isFavorite,
      }).unwrap();
      setIsFavorite(!isFavorite);

      alert(
        isFavorite
          ? "Recipe removed from favorites!"
          : "Recipe added to favorites!"
      );
    } catch (error) {
      console.error("Error adding favorite recipe", error);
    }
    console.log(favoriteRecipe);
  };
  const [recipeArr, setRecipeArr] = useState([]);
  useEffect(() => {
    if (isSuccess) {
      setRecipeArr(data);
    }
  }, [data]);

  // const [ingredientsArr, setIngredientsArr] = useState([]);
  // useEffect(() => {
  //   if (ingredientSuccess) {
  //     setIngredientsArr(ingredients);
  //   }
  // }, [ingredients]);

  // const [categoryArr, setCategoryArr] = useState([]);
  // useEffect(() => {
  //   if (categorySuccess) {
  //     setCategoryArr(categories);
  //   }
  // }, [categories]);

  const returnToList = () => {
    navigate("/recipes");
  };
  // console.log("Ingredients", ingredientsArr);
  // console.log("Categories", categoryArr);
  // const { name, description, photo, favorite } = [recipe];

  return (
    <>
      <div>
        <div>
          {/* {recipeArr?.map((recipe) => ( */}
          {/* <div key={recipeArr.id}> */}
          <div>
            <div>
              <img src={recipeArr.photo} alt={name} />
            </div>
            <h4>{recipeArr.name}</h4>
            <h4>Categories</h4>
            <ul>
              {recipeArr?.categories?.map((cat) => {
                return(
                <li key={cat.id}> {cat.name}</li>)
              })}
            </ul>
            <p>{recipeArr.description}</p>
            <h4>Ingredients</h4>
            <ul>
              {recipeArr?.ingredient?.map((ing) => {
                return(
                <li key={ing.id}>{ing.quantity} {ing.unit.name} of {ing.ingredient.name} </li>)
              })}
            </ul>
            <h4>Instructions</h4>
            <ul>
              {recipeArr?.instructions?.map((inst) => {
                return(
                <li key={inst.id}> {inst.instruction}</li>)
              })}
            </ul>
        

            {/* {ingredientsArr && ingredientsArr.length > 0 ? (
              <ul>
                {ingredientsArr.map((ingredient, index) => (
                  <li key={index}>{ingredient.unit.name} {ingredient.ingredient.name}</li>
                ))}
              </ul>
            ) : (
              <p>No ingredients available</p>
            )} */}
            {/* <p>{ingredientsArr.ingredients}</p> */}
            {/* <ul>
              {ingredients &&
                ingredients.map((ingredient) => (
                  <li key={ingredient.id || ingredient.name}>{ingredient}</li>
                ))}
            </ul> */}
            <h4>Instructions</h4>
            {/* <ul>
                {instructions &&
                  instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
              </ul> */}
            <h4>Categories</h4>
            {/* {categoryArr && categoryArr.length > 0 ? (
              <ul>
                {categoryArr.map((categories) => (
                  <li key={categories.id}>{categories.name}</li>
                ))}
              </ul>
            ) : (
              <p>No categories available</p>
            )} */}
            {/* <ul>
              {categories &&
                categories.map((category, index) => (
                  <li key={index}>{category}</li>
                ))}
            </ul> */}
          </div>
          {/* ))} */}
          <p>
            {sessionStorage.getItem("token") && (
              <button onClick={handleFavorite}>
                {" "}
                <p>
                  Favorite:{" "}
                  {isFavorite ? (
                    <i
                      className="bi bi-heart-fill"
                      style={{ color: "red" }}
                    ></i>
                  ) : (
                    <i className="bi bi-heart"></i>
                  )}
                </p>
                {/* {isFavorite ? "Remove from Favorites" : "Add to Favorites"} */}
              </button>
            )}
          </p>
        </div>
      </div>
      <br />
      <div>
        <button onClick={returnToList}>Return to Recipes List</button>
      </div>
    </>
  );
}

//   return (
//     <>
//       <div>
//       {currentItems?.map((recipe) => (
//             <div className="col-4" key={recipe?.id}>
//           <h4>{name}</h4>
//           <p>{description}</p>
//           </div>
//           ))}
//           {/* <h4>{ingredients}</h4>
//           <ul>
//             {ingredients &&
//               ingredients.map((ingredient, index) => (
//                 <li key={index}>{ingredient}</li>
//               ))}
//           </ul>
//           <h4>{instructions}</h4>
//           <ul>
//             {instructions &&
//               instructions.map((instruction, index) => (
//                 <li key={index}>{instruction}</li>
//               ))}
//           </ul>
//           <h4>{categories}</h4>
//           <ul>
//             {categories &&
//               categories.map((category, index) => (
//                 <li key={index}>{category}</li>
//               ))}
//           </ul> */}

//           <p>
//             {sessionStorage.getItem("token") && (
//               <button onClick={handleFavorite}>
//                 {" "}
//                 <p>
//                   Favorite:{" "}
//                   {isFavorite ? (
//                     <i
//                       className="bi bi-heart-fill"
//                       style={{ color: "red" }}
//                     ></i>
//                   ) : (
//                     <i className="bi bi-heart"></i>
//                   )}
//                 </p>
//                 {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
//               </button>
//             )}
//           </p>
//         </div>
//         {/* <div>
//           <img src={photo} alt={name} />
//         </div> */}
//       </div>
//       <br />
//       <div>
//         <button onClick={returnToList}>Return to Recipes List</button>
//       </div>
//     </>
//   );
// }
