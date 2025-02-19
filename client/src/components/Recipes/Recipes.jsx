import { useState, useEffect } from "react";
import { useGetRecipesQuery } from "./RecipesSlice";
import { useNavigate } from "react-router-dom";

export default function Recipes() {
  const { data, isSuccess, isLoading, error } = useGetRecipesQuery();
  const [recipeFilter, setRecipeFilter] = useState({
    recipeSearch: "",
  });
  const navigate = useNavigate();
  const [recipeArr, setRecipeArr] = useState();

  const seeRecipeDetails = (id) => {
    navigate(`/recipes/${id}`);
  };

  useEffect(() => {
    if (isSuccess) {
      setRecipeArr(data);
    }
  }, [data]);

  const update = (e) => {
    setRecipeFilter({
      recipeSearch: e.target.value,
    });
    const temp = e.target.value.toLowerCase();
    if (temp.length === 0) {
      setRecipeArr(data);
    } else {
      const filteredRecipes = data.filter((element) => {
        return element.name.toLowerCase().includes(temp);
      });
      setRecipeArr(filteredRecipes);
    }
  };

  return (
    <article>
      <h2>Recipes</h2>
      <form>
        <label>
          <p className="searchbar">
            Search by Name or Ingredient:{" "}
            <input
              className="inputfield"
              name="recipeSearch"
              value={recipeFilter.recipeSearch}
              onChange={update}
            />
          </p>
        </label>
      </form>
      <p>
        {isLoading && "Loading recipes..."}
        {error && "Error loading recipes..."}
      </p>

      <div className="grid-container">
        <ul className="books">
          {recipeArr?.map((p) => (
            <li key={p.id}>
              <p className="booktitle">{p.name} </p>
              <p className="bookauthor">{p.description}</p>
              {/* <figure>
                <img src={p.photo} alt={p.name} className="bookimage" />
              </figure> */}

              <button
                className="detailbutton"
                onClick={() => seeRecipeDetails(p.id)}
              >
                Click for Recipe
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
