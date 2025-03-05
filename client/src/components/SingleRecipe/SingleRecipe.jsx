import { useEffect, useState, refetch } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetRecipeQuery,
  usePostReviewMutation,
  usePostCommentMutation,
} from "./SingleRecipeSlice";
import { useParams } from "react-router-dom";
import {
  useAddFavoriteRecipeMutation,
  useDeleteFavoriteRecipeMutation,
  useGetFavoriteRecipesQuery,
} from "../Recipes/RecipesSlice";
import { getLogin, getUser } from "../../app/confirmLoginSlice";
import StarRating from "./StarRating";
import EditRecipeForm from "./EditRecipe";

export default function SingleRecipe() {
  const { id } = useParams();
  const { data, isSuccess } = useGetRecipeQuery(id);
  const [favoriteRecipe] = useAddFavoriteRecipeMutation();
  const [deleteFavoriteRecipe] = useDeleteFavoriteRecipeMutation();
  const [addReview] = usePostReviewMutation();
  const [addComment] = usePostCommentMutation();
  const [review, setReview] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = useSelector(getLogin);
  const authUser = useSelector(getUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState();
  const dispatch = useDispatch();

  // console.log("auth:", auth);

  // const user = useSelector((state) => state.confirmLogin.user);
  // console.log("User in component:", user);

  const { data: favoriteRecipes, isSuccess: isFavoriteRecipesFetched } =
    useGetFavoriteRecipesQuery({ id });

  const [recipeArr, setRecipeArr] = useState([]);
  useEffect(() => {
    if (isSuccess && data) {
      setRecipeArr(data);
    }
  }, [data, isSuccess]);
  console.log("Recipe array", recipeArr);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      name: data?.name,
    });
  };

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("user");
    if (storedUser && !authUser) {
      dispatch(confirmLogin(JSON.parse(storedUser)));
    }
  }, [authUser, dispatch]);

  const isCreator =
    authUser && recipeArr?.creatorId && recipeArr.creatorId === authUser.id;

  const handleStarClick = (value) => {
    setRating(value);
  };

  useEffect(() => {
    if (isFavoriteRecipesFetched && favoriteRecipes) {
      const isRecipeFavorite = favoriteRecipes.some(
        (recipe) => recipe.recipeId === parseInt(id)
      );
      setIsFavorite(isRecipeFavorite);
    }
  }, [favoriteRecipes, isFavoriteRecipesFetched, id]);

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await deleteFavoriteRecipe({ id: id }).unwrap();
        setIsFavorite(false);
      } else {
        await favoriteRecipe({
          recipeId: id,
        }).unwrap();
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error adding favorite recipe", error);
    }
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
      // console.log("New Review Object:", newReview);
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

  const averageRating = calculateAverageRating(recipeArr?.review);
  // console.log("creator", isCreator);
  // console.log("Creator ID in recipe:", recipeArr.creatorId);
  // console.log("Logged-in user ID:", auth.id);

  return (
    <>
      <div className="container">
        {isEditing ? (
          <div className="card" style={{ minWidth: "42rem", margin: "auto" }}>
            {recipeArr?.photo ? (
              <img
                src={recipeArr.photo}
                className="card-img-top"
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
                alt={recipeArr.name}
              />
            ) : (
              <img
                src="https://placehold.co/600x600?text=No+Photo+Available"
                className="card-img-top"
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
              />
            )}

            <div className="card-body">
              <EditRecipeForm id={id} />{" "}
              <button type="button" onClick={handleCancelClick}>
                Cancel
              </button>
            </div>

            {/* ADD INSTRUCTIONS AND INGREDIENTS TO FORM HERE */}
          </div>
        ) : (
          <div className="card" style={{ minWidth: "42rem", margin: "auto" }}>
            {recipeArr?.photo ? (
              <img
                src={recipeArr.photo}
                className="card-img-top"
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
                alt={recipeArr.name}
              />
            ) : (
              <img
                src="https://placehold.co/600x600?text=No+Photo+Available"
                className="card-img-top"
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
              />
            )}

            <div className="card-body">
              <h5 className="card-title">
                {recipeArr.name}{" "}
                {auth && (
                  <button onClick={handleFavorite} className="btn">
                    {" "}
                    <span>
                      {isFavorite ? (
                        <i
                          className="bi bi-heart-fill"
                          style={{ color: "red" }}
                        ></i>
                      ) : (
                        <i className="bi bi-heart"></i>
                      )}
                    </span>
                  </button>
                )}{" "}
                {isCreator && (
                  <i className="bi bi-pencil" onClick={handleEditClick}></i>
                )}
              </h5>

              {recipeArr?.categories?.map((cat) => {
                return (
                  <p
                    key={cat.id}
                    style={{ marginRight: "6px" }}
                    className="badge text-bg-secondary"
                  >
                    {cat.name}
                  </p>
                );
              })}
              <div className="star-rating">
                {renderStarAverage(Math.round(averageRating))}
              </div>
              <small>Average Rating: {averageRating.toFixed()} / 5</small>
              <br />
              <br />

              <p className="card-text lead">{recipeArr.description}</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <h5>Ingredients</h5>
                <ul className="list-group list-group-flush">
                  {recipeArr?.ingredient?.map((ing) => {
                    return (
                      <li key={ing.id} className="list-group-item">
                        {ing.quantity} {ing.unit.name} of {ing.ingredient.name}{" "}
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="list-group-item">
                <h5>Instructions</h5>
                <ol className="list-group list-group-flush list-group-numbered">
                  {recipeArr?.instructions?.map((inst) => {
                    return (
                      <li key={inst.id} className="list-group-item">
                        {" "}
                        {inst.instruction}
                      </li>
                    );
                  })}
                </ol>
              </li>
            </ul>
          </div>
        )}

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
                  <div className="card-body">
                    <h6 className="card-title">{rev.review}</h6>
                    <h6 className="card-subtitle mb-2 text-body-secondary">
                      {" "}
                      <p className="star-rating">{renderStars(rev.rating)} </p>
                    </h6>
                    <p className="card-text">
                      - {rev.user ? rev.user.firstName : ""}{" "}
                      {rev.user ? rev.user.lastName[0] : ""}
                    </p>
                  </div>

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
