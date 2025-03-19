import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetRecipeQuery,
  usePostReviewMutation,
  usePostCommentMutation,
  useDeleteReviewMutation,
  useDeleteCommentMutation,
} from "./SingleRecipeSlice";
import { useParams } from "react-router-dom";
import { getLogin, getUser, confirmLogin } from "../../app/confirmLoginSlice";
import StarRating from "./StarRating";
import EditReviewForm from "./EditReview";
import EditCommentForm from "./EditComment";
import { format } from "date-fns";

export default function ReviewSection() {
  const { id } = useParams();
  // Fetch user data and set up necessary states
  const { data, isSuccess, refetch } = useGetRecipeQuery(id);
  const [addReview] = usePostReviewMutation();
  const [addComment] = usePostCommentMutation();
  const [review, setReview] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const auth = useSelector(getLogin);
  const authUser = useSelector(getUser);
  const dispatch = useDispatch();
  const [deleteReview] = useDeleteReviewMutation(id);
  const [deleteComment] = useDeleteCommentMutation(id);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const role = window.sessionStorage.getItem("role");

  const [recipeArr, setRecipeArr] = useState([]);
  // When recipe data is available, update recipeArr state
  useEffect(() => {
    if (isSuccess && data) {
      setRecipeArr(data);
    }
  }, [data, isSuccess]);

  // Refetch data if user is authenticated or admin
  useEffect(() => {
    if (authUser || role === "ADMIN") {
      refetch();
    }
  }, [authUser, role, refetch]);

  // Retrieve and parse user data from sessionStorage if it exists
  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && !authUser) {
          dispatch(confirmLogin(parsedUser));
        }
      } catch (e) {
        console.error("Error parsing user data from sessionStorage:", e);
      }
    }
  }, [authUser, dispatch]);

  const handleStarClick = (value) => {
    setRating(value);
  };

  // Format the date
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy hh:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  // Function to post a new review
  async function postReview(event) {
    event.preventDefault();
    try {
      setErrorMessage(""); // Clear any previous error messages
      const user = auth; // Get authenticated user details
      const newReview = await addReview({
        review,
        rating,
        recipe: id,
        user: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      }).unwrap();

      // Update state with new review
      setRecipeArr((prevRecipeArr) => ({
        ...prevRecipeArr,
        review: [newReview, ...prevRecipeArr.review],
      }));
      setReview(""); // Clear review input
      setRating(0); // Reset the rating
      setSuccessMessage(true);
      refetch(); // Refetch data to update reviews
    } catch (error) {
      if (error?.data?.message) {
        setErrorMessage(error.data.message);
      }
    }
  }

  const [commentSuccessMessage, setCommentSuccessMessage] = useState({});

  const [activeReviewId, setActiveReviewId] = useState(null);
  const handleButtonClick = (reviewId) => {
    if (!isEditingReview) {
      // Toggle review edit state
      setActiveReviewId((prevId) => (prevId === reviewId ? null : reviewId));
    }
  };

  // Function to post a new comment for a review
  async function postComment(event, reviewId) {
    event.preventDefault();
    try {
      const user = auth; // Get authenticated user details
      const newComment = await addComment({
        comment,
        review: reviewId,
        user: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      }).unwrap();

      // Update recipe state with the new comment
      setRecipeArr((prevRecipeArr) => ({
        ...prevRecipeArr,
        review: prevRecipeArr.review.map((rev) =>
          rev.id === newComment.reviewId
            ? { ...rev, comments: [...rev.comments, newComment] }
            : rev
        ),
      }));
      setComment(""); // Clear comment input
      setCommentSuccessMessage((prevState) => ({
        ...prevState,
        [reviewId]: "Thanks for your comment!",
      }));
      refetch(); // Refetch data to update comments
    } catch (error) {
      console.error("Error posting comment:", error);
      setErrorMessage(
        "There was an issue posting your comment. Please try again."
      );
    }
    setActiveReviewId(null);
  }

  const cancelComment = () => {
    setActiveReviewId(null);
  };

  // Function to delete a review
  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview({ id });
      setRecipeArr((prevRecipeArr) => ({
        ...prevRecipeArr,
        review: prevRecipeArr.review.filter((rev) => rev.id !== id),
      }));
      alert("Review deleted.");
      console.log(`Deleting item with ID: ${id}`);
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const handleEditReview = (reviewId) => {
    setIsEditingReview(true);
    setActiveReviewId(reviewId);
  };

  const handleEditCancelReview = () => {
    setIsEditingReview(false);
    setActiveReviewId(null);
  };

  // Function to delete a comment
  const handleDeleteComment = (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteComment({ id });
      setRecipeArr((prevRecipeArr) => ({
        ...prevRecipeArr,
        review: prevRecipeArr.review.map((rev) => ({
          ...rev,
          comments: rev.comments.filter((comment) => comment.id !== id),
        })),
      }));
      alert("Comment deleted.");
      console.log(`Deleting item with ID: ${id}`);
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const handleEditComment = (commentId) => {
    setIsEditingComment(true);
    setCurrentCommentId(commentId);
  };

  const handleEditCancelComment = () => {
    setIsEditingComment(false);
    setCurrentCommentId(null);
  };

  return (
    <>
      <div className="container">
        <br />

        {recipeArr?.review?.length === 0 ? (
          <h1 className="display-6">No reviews yet</h1>
        ) : (
          <h1 className="display-6">Reviews</h1>
        )}

        <br />

        {auth && (
          <>
            <form onSubmit={postReview}>
              <div className="mb-0">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Leave a review:
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  name="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="rating mb-1">
                <StarRating
                  initialRating={rating}
                  onRatingChange={handleStarClick}
                />
              </div>

              <button className="button-details">Submit</button>
            </form>
            <br />
            {successMessage && (
              <p className="alert alert-success" role="alert">
                Thanks for your review!
              </p>
            )}
            {errorMessage && (
              <p className="alert alert-danger" role="alert">
                {errorMessage}
              </p>
            )}
          </>
        )}

        {recipeArr?.review?.map((rev) => {
          const isCreator =
            authUser && rev?.userId && rev.userId === authUser.id;

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
              <div>
                <div className="card" key={rev.id}>
                  {activeReviewId === rev.id && isEditingReview ? (
                    <EditReviewForm
                      reviewId={rev.id}
                      onCancel={handleEditCancelReview}
                      setIsEditingReview={setIsEditingReview}
                      setRecipeArr={setRecipeArr}
                      setActiveReviewId={setActiveReviewId}
                    />
                  ) : (
                    <div className="card-body">
                      <div className="d-flex mb-0">
                        <div className="p-0">
                          <h6 className="card-title">{rev.review}</h6>{" "}
                          <p className="star-rating">
                            {renderStars(rev.rating)}{" "}
                          </p>
                        </div>
                        <div className="ms-auto p-0">
                          {isCreator && (
                            <span>
                              <i
                                className="bi bi-pencil-square"
                                onClick={() => handleEditReview(rev.id)}
                              ></i>
                              <br />
                              <i
                                className="bi bi-trash"
                                onClick={() => handleDeleteReview(rev.id)}
                              ></i>
                            </span>
                          )}
                          {role === "ADMIN" && !isCreator && (
                            <span>
                              <i
                                className="bi bi-pencil-square"
                                onClick={() => handleEditReview(rev.id)}
                              ></i>
                              &nbsp;
                              <i
                                className="bi bi-trash"
                                onClick={() => handleDeleteReview(rev.id)}
                              ></i>
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="card-text">
                        &mdash;{" "}
                        <i>
                          {rev.user ? rev.user.firstName : ""}{" "}
                          {rev.user ? rev.user.lastName[0] : ""}
                        </i>
                      </p>
                      <p className="date-stamp">
                        Posted on {formatDate(rev.createdAt)}
                      </p>
                    </div>
                  )}

                  {auth && !isEditingReview && (
                    <div className="card-footer">
                      <button
                        onClick={() => handleButtonClick(rev.id)}
                        className="button-details-alt"
                      >
                        Leave a Comment
                      </button>
                      {activeReviewId === rev.id && (
                        <form onSubmit={(e) => postComment(e, rev.id)}>
                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlTextarea1"
                              className="form-label"
                            ></label>
                            <textarea
                              className="form-control"
                              id="exampleFormControlTextarea1"
                              rows="3"
                              name="comment"
                              value={comment}
                              required
                              onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                          </div>
                          <button className="button-details">Submit</button>{" "}
                          <button
                            className="button-details"
                            onClick={cancelComment}
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                      {commentSuccessMessage[rev.id] && (
                        <>
                          <br />
                          <br />
                          <p className="alert alert-success" role="alert">
                            {commentSuccessMessage[rev.id]}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {rev.comments?.length > 0 ? (
                    <div className="card-footer">
                      <h6>Comments:</h6>
                      <ul className="list-group list-group-flush">
                        {rev.comments?.map((comment) => {
                          const isCommentCreator =
                            authUser &&
                            comment.user?.id &&
                            comment.user.id === authUser.id;
                          return (
                            <li
                              key={comment.id}
                              className="list-group-item comment-section"
                              style={{ backgroundColor: "transparent" }}
                            >
                              {isEditingComment &&
                              currentCommentId === comment.id ? (
                                <EditCommentForm
                                  commentId={currentCommentId}
                                  onCancel={handleEditCancelComment}
                                  setIsEditingComment={setIsEditingComment}
                                  setRecipeArr={setRecipeArr}
                                />
                              ) : (
                                <div className="comment-content">
                                  <span className="comment-text">
                                    {comment.comment}
                                    <br />
                                    &mdash;{" "}
                                    <i>
                                      {comment.user
                                        ? comment.user.firstName
                                        : ""}{" "}
                                      {comment.user
                                        ? comment.user.lastName[0]
                                        : ""}
                                    </i>
                                    <p className="date-stamp mt-2">
                                      {formatDate(comment.createdAt)}
                                    </p>
                                  </span>

                                  {isCommentCreator && (
                                    <span className="comment-actions m-1">
                                      <i
                                        className="bi bi-pencil-square"
                                        onClick={() =>
                                          handleEditComment(comment.id)
                                        }
                                      ></i>
                                      &nbsp;
                                      <i
                                        className="bi bi-trash"
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                      ></i>
                                    </span>
                                  )}
                                  {role === "ADMIN" && !isCommentCreator && (
                                    <span className="comment-actions m-1">
                                      <i
                                        className="bi bi-pencil-square"
                                        onClick={() =>
                                          handleEditComment(comment.id)
                                        }
                                      ></i>
                                      &nbsp;
                                      <i
                                        className="bi bi-trash"
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                      ></i>
                                    </span>
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <br />
                <br />
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
