import { useState, useEffect } from "react";
import { useGetRecipesQuery, useGetCategoriesQuery } from "./RecipesSlice";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Recipes() {
  const { data, isSuccess, isLoading, error, refetch } = useGetRecipesQuery();
  const { data: categoryList } = useGetCategoriesQuery();
  const [recipeFilter, setRecipeFilter] = useState({
    recipeSearch: "",
    category: "",
    minRating: 0,
  });
  const navigate = useNavigate();
  const [recipeArr, setRecipeArr] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;

  // Function to calculate the average rating of user reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Function to filter recipes based on search, category, and rating
  const applyFilter = (data, searchTerm, categories, minRating) => {
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
      })
      .filter((recipe) => {
        const avgRating = calculateAverageRating(recipe.review);
        return avgRating >= minRating;
      });
  };

  // Function to get recipes for the current page
  const getCurrentPageItems = (filteredRecipes) => {
    const endOffset = itemOffset + itemsPerPage;
    return filteredRecipes.slice(itemOffset, endOffset);
  };

  const seeRecipeDetails = (id) => {
    navigate(`/recipes/${id}`);
  };

  useEffect(() => {
    if (isSuccess) {
      setRecipeArr(data); // Set the recipes data to recipeArr
      refetch();
    }
  }, [data, refetch, isSuccess]);

  // Update search term in filter state
  const updateSearch = (e) => {
    setRecipeFilter({
      ...recipeFilter,
      recipeSearch: e.target.value,
    });
    setItemOffset(0);
  };

  // Update selected category in filter state
  const updateCategory = (e) => {
    setRecipeFilter({
      ...recipeFilter,
      category: e.target.value,
    });
    setItemOffset(0);
  };

  // Update minimum rating in filter state
  const updateRating = (e) => {
    setRecipeFilter({
      ...recipeFilter,
      minRating: parseFloat(e.target.value),
    });
    setItemOffset(0);
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredRecipes.length;
    setItemOffset(newOffset);
  };

   // Apply all filters to recipe data
  const filteredRecipes = applyFilter(
    recipeArr,
    recipeFilter.recipeSearch,
    recipeFilter.category,
    recipeFilter.minRating
  );
  const currentItems = getCurrentPageItems(filteredRecipes);
  const pageCount = Math.ceil(filteredRecipes.length / itemsPerPage);

  // Function to render star rating display based on average rating
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
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          <h2>Recipes</h2>
          {error && <p>Error loading recipes...</p>}
          <form>
            <label>
              <p>
                Search by Name or Ingredient:{" "}
                <input
                  className="form-control"
                  name="recipeSearch"
                  value={recipeFilter.recipeSearch}
                  onChange={updateSearch}
                />
              </p>
            </label>
            &nbsp;&nbsp;&nbsp;
            <label>
              <p>
                Filter by Category:{" "}
                <select
                  className="form-select"
                  value={recipeFilter.category}
                  onChange={updateCategory}
                >
                  <option value="">Select Category</option>
                  {categoryList?.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </p>
            </label>
            &nbsp;&nbsp;&nbsp;
            <label>
              <p>
                Filter by Minimum Rating:{" "}
                <select
                  className="form-select"
                  value={recipeFilter.minRating}
                  onChange={updateRating}
                >
                  <option value={0}>All Ratings</option>
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </p>
            </label>
          </form>

          <div>
            <div className="row g-2">
              {currentItems?.map((recipe) => (
                <div className="col-md-4" key={recipe.id}>
                  <div
                    className="card h-100"
                    style={{ padding: "0", margin: "auto" }}
                  >
                    {recipe?.photo ? (
                      <img
                        src={recipe.photo}
                        className="card-img-top"
                        style={{
                          width: "100%",
                          height: "20vw",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src="https://placehold.co/600x600?text=No+Photo+Available"
                        className="card-img-top"
                        style={{
                          width: "100%",
                          height: "20vw",
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
            <nav aria-label="Page navigation">
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
      )}
    </>
  );
}
