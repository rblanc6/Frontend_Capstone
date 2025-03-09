import { useState, useEffect } from "react";
import { useGetRecipesQuery, useGetCategoriesQuery } from "./RecipesSlice";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Recipes() {
  const { data, isSuccess, isLoading, error } = useGetRecipesQuery();
  const { data: categoryList } = useGetCategoriesQuery();
  console.log(data);
  const [recipeFilter, setRecipeFilter] = useState({
    recipeSearch: "",
    category: "",
  });
  const navigate = useNavigate();
  const [recipeArr, setRecipeArr] = useState([]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;



  const applyFilter = (data, searchTerm, categories) => {
   

    return data
      .filter((recipe) => {
        const nameMatch = recipe.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const ingredientMatch = recipe.ingredient.some((item) =>
          item.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return nameMatch || ingredientMatch;
      })
      .filter((recipe) => {
        if (categories) {
          return recipe.categories?.some(
            (category) =>
              category.name.toLowerCase() === categories.toLowerCase()
          );
        }
        return true;
      });

  };

  const getCurrentPageItems = (filteredRecipes) => {
    const endOffset = itemOffset + itemsPerPage;
    return filteredRecipes.slice(itemOffset, endOffset);
  };

  const seeRecipeDetails = (id) => {
    navigate(`/recipes/${id}`);
  };

  useEffect(() => {
    if (isSuccess) {
      setRecipeArr(data);
    }
  }, [data, isSuccess]);

  const updateSearch = (e) => {
    setRecipeFilter({
      ...recipeFilter,
      recipeSearch: e.target.value,
    });
    setItemOffset(0);
  };

  const updateCategory = (e) => {
    setRecipeFilter({
      ...recipeFilter,
      category: e.target.value,
    });
    setItemOffset(0);
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredRecipes.length;
    setItemOffset(newOffset);
  };

  const filteredRecipes = applyFilter(
    recipeArr,
    recipeFilter.recipeSearch,
    recipeFilter.category
  );
  const currentItems = getCurrentPageItems(filteredRecipes);
  const pageCount = Math.ceil(filteredRecipes.length / itemsPerPage);

  console.log(currentItems);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const renderStarAverage = (rating) => {
    const totalStars = 5;
    let stars = [];

    for (let i = 0; i < totalStars; i++) {
      if (i < rating) {
        stars.push(
          <span key={i} className="star-rating">
            <i className="bi bi-star-fill"></i>
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-rating-empty">
            <i className="bi bi-star-fill"></i>
          </span>
        );
      }
    }

    return stars;
  };

  return (
    <>
      <div className="container">
        <h2>Recipes</h2>
        <form>
          <label>
            <p>
              Search by Name, Ingredient, or Category:{" "}
              <input
                className="form-control"
                name="recipeSearch"
                value={recipeFilter.recipeSearch}
                onChange={updateSearch}
              />
            </p>
          </label>&nbsp;&nbsp;&nbsp;
          <label>
            <p>
              Select Category:{" "}
              <select
                className="form-select"
                value={recipeFilter.category}
                onChange={updateCategory}
              >
                <option value="">All Categories</option>
                {categoryList?.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </p>
          </label>
        </form>
        <p>
          {isLoading && "Loading recipes..."}
          {error && "Error loading recipes..."}
        </p>
        <div>
          <div className="row g-3">
            {currentItems?.map((recipe) => (
              <div className="col" key={recipe.id}>
                <div
                  className="card h-100"
                  style={{ padding: "0", width: "18rem", margin: "auto" }}
                >
                  {recipe?.photo ? (
                    <img
                      src={recipe.photo}
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src="https://placehold.co/600x600?text=No+Photo+Available"
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="card-body" style={{ marginBottom: "20px" }}>
                    <h5 className="card-title">{recipe.name}</h5>
                    <p className="card-text">{recipe.description}</p>
                    <p className="mb-0 pb-0">
                      {recipe.review &&
                        recipe.review.length > 0 &&
                        renderStarAverage(
                          Math.round(calculateAverageRating(recipe.review))
                        )}
                    </p>
                  </div>

                  <div className="card-body">
                    <button
                      className="button-details"
                      onClick={() => seeRecipeDetails(recipe.id)}
                      style={{
                        position: "absolute",
                        bottom: "0",
                        margin: "20px 0",
                      }}
                    >
                      Click for Recipe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <br />
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
      </div>
    </>
  );
}
