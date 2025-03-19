import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function MyRecipes() {
  const { id } = useParams();
  // Fetch user data and set up necessary states
  const { data, isSuccess, isLoading, error, refetch } = useGetUserQuery(id);
  const [user, setUser] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  // Update user data when data is successfully fetched
  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data, isSuccess]);

  // Refetch data if the user state changes
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  // Function to calculate the average rating of user reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

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

  // Handle page change for pagination
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  // Calculate the slice for the current page’s favorites
  const indexOfLastRecipe = (currentPage + 1) * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const myRecipes = user?.recipes?.slice(indexOfFirstRecipe, indexOfLastRecipe);

   //Truncate recipe descriptions to show less text in the recipe cards
   const LongText = ({ content, limit }) => {
    const [showAll, setShowAll] = useState(false);

    const showMore = () => setShowAll(true);
    const showLess = () => setShowAll(false);

    if (content.length <= limit) {
      return <div>{content}</div>;
    }
    if (showAll) {
      return (
        <div>
          {content}
          <span
            onClick={showLess}
            style={{ color: "#de296c", marginLeft: "4px" }}
          >
            <small>Read less</small>
          </span>
        </div>
      );
    }

    const toShow = content.substring(0, limit) + "...";
    return (
      <div>
        {toShow}
        <span
          onClick={showMore}
          style={{ color: "#de296c", marginLeft: "4px" }}
        >
          <small>Read more</small>
        </span>
      </div>
    );
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
          <h2 className="mb-4">My Recipes</h2>
          {error && <p>Error loading user...</p>}
          {user?.recipes?.length === 0 ? (
            <>
              <p>You have not shared any recipes yet.</p>
              <p>
                <Link
                  to="/new-recipe"
                  className="button-details-alt"
                  style={{ textDecoration: "none" }}
                >
                  Share a Recipe
                </Link>
              </p>
            </>
          ) : (
            <>
              {myRecipes?.map((recipe) => {
                return (
                  <div key={recipe.id} className="card mb-3">
                    <div className="row g-0">
                      <div className="col-md-4">
                        {recipe.photo ? (
                          <img
                            src={recipe.photo}
                            className="img-fluid rounded-start"
                            alt={recipe.name}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <img
                            src="https://placehold.co/600x600?text=No+Photo+Available"
                            className="img-fluid rounded-start"
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h4 className="card-title mb-0">
                            <Link
                              className="link-style"
                              to={`/recipes/${recipe.id}`}
                            >
                              {recipe.name}
                            </Link>
                          </h4>
                          <p className="mb-0 pb-0">
                            {recipe.review &&
                              recipe.review.length > 0 &&
                              renderStarAverage(
                                Math.round(
                                  calculateAverageRating(recipe.review)
                                )
                              )}
                          </p>

                          <p className="card-text"><LongText content={recipe.description} limit={200} /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {Math.ceil(user?.recipes?.length) > 5 ? (
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center">
                    <li className="page-item">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={handlePageChange}
                        pageRangeDisplayed={5}
                        pageCount={Math.ceil(
                          user?.recipes?.length / itemsPerPage
                        )}
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
              ) : (
                ""
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
