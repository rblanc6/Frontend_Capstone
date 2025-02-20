import { useState, useEffect } from "react";
import { useGetRecipesQuery } from "./RecipesSlice";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Recipes() {
  const { data, isSuccess, isLoading, error } = useGetRecipesQuery();
  const [recipeFilter, setRecipeFilter] = useState({
    recipeSearch: "",
  });
  const navigate = useNavigate();
  const [recipeArr, setRecipeArr] = useState([]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = recipeArr.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(recipeArr.length / itemsPerPage);

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

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % recipeArr.length;
    setItemOffset(newOffset);
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
      <div className="container text-center">
        <div className="row">
          {currentItems?.map((recipe) => (
            <div className="col-md-3" key={recipe.id}>
              <img src={recipe.photo} className="img-thumbnail" />
              <h5>{recipe.name}</h5>
              <button
                className="btn btn-outline-dark"
                onClick={() => seeRecipeDetails(recipe.id)}
              >
                Click for Recipe
              </button>
            </div>
          ))}
        </div>
        
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                containerClassName="pagination"
                activeClassName="active"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
              />
            </li>
          </ul>
        </nav>
        
      </div>
    </article>
  );
}
