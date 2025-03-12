import { useState, useEffect } from "react";
import { useGetUserDetailsQuery } from "./AdminSlice";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";

export default function UserDetailsList({ isListView }) {
  const { id } = useParams();
  const { data, isSuccess } = useGetUserDetailsQuery(id);
  const [userDetails, setUserDetails] = useState("");
  const [recipePage, setRecipePage] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  const [commentPage, setCommentPage] = useState(0);

  const itemsPerPage = 5;

  useEffect(() => {
    if (isSuccess) {
      setUserDetails(data);
    }
  }, [data, isSuccess]);

  console.log(userDetails?.comments);

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

  return (
    <>
      <div className="mt-3">
        <h1 className="display-6">User Details</h1>
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
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Created On</th>
              <th scope="col">{""}</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paginatedRecipes) && paginatedRecipes.length > 0 ? (
              paginatedRecipes.map((recipe, index) => (
                <tr key={index}>
                  <td>{recipe.name}</td>
                  <td>{recipe.description}</td>
                  <td>{formatDate(recipe.createdAt)}</td>
                  <td style={{ minWidth: "150px", textAlign: "right" }}>
                  <Link
                          to={`/recipes/${recipe.id}`}
                        className="button-details"
                        style={{
                         textDecoration: "none"
                        }}
                      >
                        View Recipe
                      </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Recipes Available</td>
              </tr>
            )}
          </tbody>
        </table>
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
        <table className="table table-striped">
          <tbody>
            {Array.isArray(paginatedReviews) && paginatedReviews.length > 0 ? (
              paginatedReviews.map((review, index) => (
                <tr key={index}>
                  <td>
                    <p>{review.review}</p>
                    <p className="date-stamp">
                      {formatDate(review.createdAt)} on {review?.recipe?.name}
                    </p>
                  </td>
                  <td style={{ minWidth: "150px", textAlign: "right" }}>
                  <Link
                          to={`/recipes/${review.recipe.id}`}
                        className="button-details"
                        style={{
                         textDecoration: "none"
                        }}
                      >
                        View Recipe
                      </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Reviews Available</td>
              </tr>
            )}
          </tbody>
        </table>
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
        <table className="table table-striped">
          <tbody>
            {Array.isArray(paginatedComments) &&
            paginatedComments.length > 0 ? (
              paginatedComments.map((comment, index) => (
                <tr key={index}>
                  <td>
                    <p>{comment.comment}</p>
                    <p className="date-stamp">
                      {formatDate(comment.createdAt)}
                    </p>
                    <p className="date-stamp">
                      on review: {comment.review.review}
                    </p>
                  </td>
                  <td style={{ minWidth: "150px", textAlign: "right" }}>
                  <Link
                          to={`/recipes/${comment.review.recipe.id}`}
                        className="button-details"
                        style={{
                         textDecoration: "none"
                        }}
                      >
                        View Recipe
                      </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Comments Available</td>
              </tr>
            )}
          </tbody>
        </table>
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
    </>
  );
}
