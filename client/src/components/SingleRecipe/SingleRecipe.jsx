import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetRecipeQuery, usePostReviewMutation } from "./SingleRecipeSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAddFavoriteRecipeMutation,
  useDeleteFavoriteRecipeMutation,
} from "../Recipes/RecipesSlice";
import { getLogin } from "../../app/confirmLoginSlice";

export default function SingleRecipe() {
  const { id } = useParams();
  const { data, isSuccess } = useGetRecipeQuery(id);
  // const navigate = useNavigate();
  const [favoriteRecipe] = useAddFavoriteRecipeMutation();
  const [deleteFavoriteRecipe] = useDeleteFavoriteRecipeMutation();
  const [addReview] = usePostReviewMutation();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(
    JSON.parse(sessionStorage.getItem(`favorite-${id}`)) ||
      data?.favorite ||
      false
  );
  const auth = useSelector(getLogin);
  console.log(data);

  const handleStarClick = (value) => {
    setRating(value);
    highlightStars(value);
  };

  // const highlightStars = (value) => {
  //   const stars = document.querySelectorAll(".star");
  //   stars.forEach((star) => {
  //     const starValue = parseInt(star.getAttribute("data-value"));
  //     if (starValue <= value) {
  //       star.textContent = "★";
  //       star.classList.add("active");
  //     } else {
  //       star.textContent = "☆";
  //       star.classList.remove("active");
  //     }
  //   });
  // };

  const stars = document.querySelectorAll(".star");
  const ratingValue = document.getElementById("rating-value");
  stars.forEach((star) => {
    star.addEventListener("mouseover", () => {
      const value = parseInt(star.getAttribute("data-value"));
      highlightStars(value);
    });
    star.addEventListener("mouseout", () => {
      const currentRating = parseInt(ratingValue.textContent);
      highlightStars(currentRating);
    });
    star.addEventListener("click", () => {
      const value = parseInt(star.getAttribute("data-value"));
      ratingValue.textContent = value;
      highlightStars(value);
    });
  });
  function highlightStars(value) {
    stars.forEach((star) => {
      const starValue = parseInt(star.getAttribute("data-value"));
      if (starValue <= value) {
        star.textContent = "★";
        star.classList.add("active");
      } else {
        star.textContent = "☆";
        star.classList.remove("active");
      }
    });
  }

  async function postReview(event) {
    event.preventDefault();

    try {
      await addReview({ review, rating, recipe: id }).unwrap();
      // setRecipeArr((prevRecipeArr) => ({
      //   ...prevRecipeArr,
      //   review: [...prevRecipeArr.review, newReview],  
      // }));
      // setReview("");
      // setRating(0);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFavorite = async (event) => {
    event.preventDefault();
    try {
      if (isFavorite) {
        await deleteFavoriteRecipe({ id }).unwrap();
        setIsFavorite(false);
        sessionStorage.setItem(`favorite-${id}`, false);
      } else {
        await favoriteRecipe({
          recipeId: id,
          favorite: true,
        }).unwrap();
        setIsFavorite(true);
        sessionStorage.setItem(`favorite-${id}`, true);
      }
    } catch (error) {
      console.error("Error adding favorite recipe", error);
    }
  };
  // console.log(favoriteRecipe);

  const [recipeArr, setRecipeArr] = useState([]);
  useEffect(() => {
    if (isSuccess) {
      setRecipeArr(data);
    }
  }, [data, isSuccess]);

  // const returnToList = () => {
  //   navigate("/recipes");
  // };

  return (
    <>
      <div>
        <div className="card">
          <img
            src={recipeArr.photo}
            className="card-img-top"
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
            alt={recipeArr.name}
          ></img>
          <div className="card-body">
            <h5 className="card-title">
              {recipeArr.name}
              {sessionStorage.getItem("token") && (
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
              )}
            </h5>
            <p className="card-text" className="lead">
              {recipeArr.description}
            </p>
            {recipeArr?.categories?.map((cat) => {
              return <p key={cat.id}>Categories: {cat.name}</p>;
            })}
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              {" "}
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

        {/* <button onClick={returnToList}>Return to Recipes List</button> */}
      </div>
      <br />
      <h4>Reviews</h4>

      {auth && (
        <>
          <form onSubmit={postReview}>
            <div className="mb-3">
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

            <div className="rating">
              <span
                className="star"
                data-value="1"
                onClick={() => handleStarClick(1)}
              >
                &#9734;
              </span>
              <span
                className="star"
                data-value="2"
                onClick={() => handleStarClick(2)}
              >
                &#9734;
              </span>
              <span
                className="star"
                data-value="3"
                onClick={() => handleStarClick(3)}
              >
                &#9734;
              </span>
              <span
                className="star"
                data-value="4"
                onClick={() => handleStarClick(4)}
              >
                &#9734;
              </span>
              <span
                className="star"
                data-value="5"
                onClick={() => handleStarClick(5)}
              >
                &#9734;
              </span>
            </div>
            <p>
              Rating: <span id="rating-value">0</span>
            </p>
            <button
              className="btn btn-primary"
              // type="submit"
              // value="Submit"
            >
              Submit
            </button>
          </form>
        </>
      )}
      <br />
      <br />
      <ul>
        {recipeArr?.review?.map((rev) => {
          return (
            <li key={rev.id}>
              {" "}
              {rev.review}
              <br />- {rev.user.firstName} {rev.user.lastName[0]}
              <br />
              <h5>Comments:</h5>
              {rev.comments?.length > 0 ? (
                <ul>
                  {rev.comments.map((comment) => (
                    <li key={comment.id}>
                      {comment.comment}
                      <br />- {comment.user.firstName}{" "}
                      {comment.user.lastName[0]}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p> // If there are no comments
              )}
              {/* {rev.comments?.comment?.user?.firstName}
              {console.log("Where are my comments?", rev.comments)} */}
              <hr></hr>
            </li>
          );
        })}
      </ul>
    </>
  );
}
