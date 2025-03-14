import { useState, useEffect } from "react";
import { useGetUserDetailsQuery } from "./AdminSlice";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";

export default function UserDetailsGrid({ isGridView }) {
  const { id } = useParams();
  const { data, isSuccess, isLoading, error } = useGetUserDetailsQuery(id);
  const [userDetails, setUserDetails] = useState("");
  const [recipePage, setRecipePage] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  const [commentPage, setCommentPage] = useState(0);
  const itemsPerPage = 6;
  useEffect(() => {
    if (isSuccess) {
      setUserDetails(data);
    }
  }, [data, isSuccess]);
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

  console.log(userDetails.comments);

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy hh:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }
  const handleRecipePageChange = ({ selected }) => setRecipePage(selected);
  const handleReviewPageChange = ({ selected }) => setReviewPage(selected);
  const handleCommentPageChange = ({ selected }) => setCommentPage(selected);

  const paginatedRecipes = Array.isArray(userDetails.recipes)
    ? userDetails.recipes.slice(
        recipePage * itemsPerPage,
        (recipePage + 1) * itemsPerPage
      )
    : [];
  const paginatedReviews = Array.isArray(userDetails.reviews)
    ? userDetails.reviews.slice(
        reviewPage * itemsPerPage,
        (reviewPage + 1) * itemsPerPage
      )
    : [];
  const paginatedComments = Array.isArray(userDetails.comments)
    ? userDetails.comments.slice(
        commentPage * itemsPerPage,
        (commentPage + 1) * itemsPerPage
      )
    : [];

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

  const renderStars = (rating) => {
    const totalStars = 5;
    let stars = [];

    for (let i = 0; i < totalStars; i++) {
      if (i < rating) {
        stars.push(
          <span key={i} className="star-rating">
            <i className="bi bi-star-fill"></i>
          </span>
        ); // Filled star
      } else {
        stars.push(
          <span key={i} className="star-rating-empty">
            <i className="bi bi-star-fill"></i>
          </span>
        ); // Empty star
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
        <div>
          <div className="mt-3">
            <h1 className="display-6">User Details</h1>
            {error && <p>Error loading users...</p>}
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    Name: {userDetails.firstName} {userDetails.lastName}
                  </td>
                  <td>Email: {userDetails.email}</td>
                </tr>
                <tr>
                  <td colSpan={2}>User Id: {userDetails.id}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="nav nav-fill mt-2">
            <li className="nav-item">
              <a
                className="nav-link active link-style"
                aria-current="page"
                href="#recipes"
              >
                Recipes
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link link-style" href="#reviews">
                Reviews
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link link-style" href="#comments">
                Comments
              </a>
            </li>
          </ul>
          <hr />

          <h1 className="display-6 mt-5" id="recipes">
            User&apos;s Recipes
          </h1>
          <div>
            <div className="row g-2">
              {Array.isArray(paginatedRecipes) &&
              paginatedRecipes.length > 0 ? (
                paginatedRecipes.map((recipe, index) => (
                  <div className="col-md-4" key={index}>
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

                      <div
                        className="card-body"
                        style={{ marginBottom: "20px" }}
                      >
                        <h5 className="card-title mb-0">{recipe.name}</h5>
                        <p className="mb-0 pb-0">
                          {recipe.review &&
                            recipe.review.length > 0 &&
                            renderStarAverage(
                              Math.round(calculateAverageRating(recipe.review))
                            )}
                        </p>
                        <p className="date-stamp">
                          {formatDate(recipe.createdAt)}
                        </p>
                        <p className="card-text">{recipe.description}</p>
                      </div>

                      <div className="card-body">
                        <Link
                          to={`/recipes/${recipe.id}`}
                          className="button-details"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            margin: "20px 0",
                            textDecoration: "none",
                          }}
                        >
                          View Recipe
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Recipes Available</p>
              )}
            </div>
            <ul className="pagination justify-content-center mt-3">
              <li className="page-item">
                <ReactPaginate
                  pageCount={
                    Array.isArray(userDetails.recipes)
                      ? Math.ceil(userDetails.recipes.length / itemsPerPage)
                      : 0
                  }
                  onPageChange={handleRecipePageChange}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </li>
            </ul>

            <h1 className="display-6 mt-5" id="reviews">
              User&apos;s Reviews
            </h1>

            <div className="row g-2">
              {Array.isArray(paginatedReviews) &&
              paginatedReviews.length > 0 ? (
                paginatedReviews.map((review, index) => (
                  <div className="col-md-4" key={index}>
                    <div
                      className="card h-100"
                      style={{ padding: "0", margin: "auto" }}
                    >
                      {review?.recipe?.photo ? (
                        <img
                          src={review?.recipe?.photo}
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

                      <div
                        className="card-body"
                        style={{ marginBottom: "20px" }}
                      >
                        <h5 className="card-title mb-0">
                          <LongText content={review.review} limit={100} />
                        </h5>
                        {renderStars(review.rating)}
                        <p className="date-stamp">
                          {formatDate(review.createdAt)} <br />
                          on {review?.recipe?.name}
                        </p>
    
                      </div>

                      <div className="card-body">
                        <Link
                          to={`/recipes/${review.recipe.id}`}
                          className="button-details"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            margin: "20px 0",
                            textDecoration: "none",
                          }}
                        >
                          View Recipe
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Reviews Available</p>
              )}
            </div>
            <ul className="pagination justify-content-center mt-3">
              <li className="page-item">
                <ReactPaginate
                  pageCount={
                    Array.isArray(userDetails.reviews)
                      ? Math.ceil(userDetails.reviews.length / itemsPerPage)
                      : 0
                  }
                  onPageChange={handleReviewPageChange}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </li>
            </ul>

            <h1 className="display-6 mt-5" id="comments">
              User&apos;s Comments
            </h1>
            <div className="row g-2">
              {Array.isArray(paginatedComments) &&
              paginatedComments.length > 0 ? (
                paginatedComments.map((comment, index) => (
                  <div className="col-md-4" key={index}>
                    <div
                      className="card h-100"
                      style={{ padding: "0", margin: "auto" }}
                    >
                      {comment?.review?.recipe?.photo ? (
                        <img
                          src={comment?.review?.recipe?.photo}
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

                      <div
                        className="card-body"
                        style={{ marginBottom: "20px" }}
                      >
                        <h5 className="card-title">
                          <LongText content={comment.comment} limit={100} />{" "}
                        </h5>
                        <p className="date-stamp">
                          {formatDate(comment.createdAt)} <br />
                          on {comment?.review?.review}
                        </p>
                      </div>

                      <div className="card-body">
                        <Link
                          to={`/recipes/${comment.review.recipe.id}`}
                          className="button-details"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            margin: "20px 0",
                            textDecoration: "none",
                          }}
                        >
                          View Recipe
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Comments Available</p>
              )}
            </div>
            <ul className="pagination justify-content-center mt-3">
              <li className="page-item">
                <ReactPaginate
                  pageCount={
                    Array.isArray(userDetails.comments)
                      ? Math.ceil(userDetails.comments.length / itemsPerPage)
                      : 0
                  }
                  onPageChange={handleCommentPageChange}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
