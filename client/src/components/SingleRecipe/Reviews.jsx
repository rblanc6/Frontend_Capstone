import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetRecipeQuery,
  usePostReviewMutation,
  usePostCommentMutation,
  useDeleteReviewMutation,
} from "./SingleRecipeSlice";
import { useParams } from "react-router-dom";
import { getLogin, getUser, confirmLogin } from "../../app/confirmLoginSlice";
import StarRating from "./StarRating";
import EditReviewForm from "./EditReview";

export default function ReviewSection() {
  const { id } = useParams();
  const { data, isSuccess } = useGetRecipeQuery(id);
  const [addReview] = usePostReviewMutation();
  const [addComment] = usePostCommentMutation();
  const [review, setReview] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const auth = useSelector(getLogin);
  const authUser = useSelector(getUser);
  const dispatch = useDispatch();
  const [deleteReview] = useDeleteReviewMutation(id);
  const [isEditingReview, setIsEditingReview] = useState(false);


  const [recipeArr, setRecipeArr] = useState([]);
  useEffect(() => {
    if (isSuccess && data) {
      setRecipeArr(data);
    }
  }, [data, isSuccess]);
  console.log("Recipe array", recipeArr);

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("user");
    if (storedUser && !authUser) {
      dispatch(confirmLogin(JSON.parse(storedUser)));
    }
  }, [authUser, dispatch]);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  async function postReview(event) {
    event.preventDefault();
    try {
      setErrorMessage("");
      const user = auth;
      const newReview = await addReview({
        review,
        rating,
        recipe: id,
        user: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      }).unwrap();
      setRecipeArr((prevRecipeArr) => ({
        ...prevRecipeArr,
        review: [newReview, ...prevRecipeArr.review],
      }));
      setReview("");
      setRating(0);
      setSuccessMessage(true);
    } catch (error) {
      if (error?.data?.message) {
        setErrorMessage(error.data.message);
      }
    }
  }

  const [commentSuccessMessage, setCommentSuccessMessage] = useState({});

  const [activeReviewId, setActiveReviewId] = useState(null);
  const handleButtonClick = (reviewId) => {
    setActiveReviewId((prevId) => (prevId === reviewId ? null : reviewId));
  };

  async function postComment(event, reviewId) {
    event.preventDefault();
    try {
      const user = auth;
      const newComment = await addComment({
        comment,
        review: reviewId,
        user: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      }).unwrap();
      setRecipeArr((prevRecipeArr) => ({
        ...prevRecipeArr,
        review: prevRecipeArr.review.map((rev) =>
          rev.id === newComment.reviewId
            ? { ...rev, comments: [...rev.comments, newComment] }
            : rev
        ),
      }));
      setComment("");
      setCommentSuccessMessage((prevState) => ({
        ...prevState,
        [reviewId]: "Thanks for your comment!",
      }));
    } catch (error) {
      if (error?.data?.message) {
        console.error(error.data.message);
      }
    }
    setActiveReviewId(null);

  }

  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview({ id });
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
  };


  return (
    <>
      <div className="container">
        <br />
        <h1 className="display-6">Reviews</h1>
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

              <button className="btn btn-primary">Submit</button>
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
            authUser && rev.userId && rev.userId === authUser.id;
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
                  {isEditingReview ? (<EditReviewForm
                  reviewId={rev.id}
                  onCancel={handleEditCancelReview}
                  setIsEditingReview={setIsEditingReview}
                />
              ): (<div className="card-body">

                    <div className="d-flex mb-0">
                      <div className="p-0">
                        <h6 className="card-title">{rev.review}</h6>
                      </div>
                      <div className="ms-auto p-0">
                        {isCreator && (
                          <>
                            <i className="bi bi-pencil-square" onClick={() => handleEditReview(rev.id)}></i>
                            <br />
                            <i className="bi bi-trash" onClick={() => handleDeleteReview(rev.id)}></i>
                          </>
                        )}
                      </div>
                    </div>

                    <h6 className="card-subtitle mb-2 text-body-secondary">
                      {" "}
                      <p className="star-rating">{renderStars(rev.rating)} </p>
                    </h6>
                    <p className="card-text">
                      - {rev.user ? rev.user.firstName : ""}{" "}
                      {rev.user ? rev.user.lastName[0] : ""}
                    </p>
                  </div>)}

                  {auth && (
                    <div className="card-footer">
                      <button
                        onClick={() => handleButtonClick(rev.id)}
                        className="btn btn-outline-secondary"
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

                          <button className="btn btn-primary">Submit</button>
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
                        {rev.comments?.map((comment) => (
                          <li
                            key={comment.id}
                            className="list-group-item"
                            style={{ backgroundColor: "transparent" }}
                          >
                            {comment.comment}
                            <br />- {comment.user
                              ? comment.user.firstName
                              : ""}{" "}
                            {comment.user ? comment.user.lastName[0] : ""}
                          </li>
                        ))}
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
