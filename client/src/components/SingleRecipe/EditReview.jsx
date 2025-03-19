import { useState, useEffect } from "react";
import { useEditReviewMutation, useGetReviewQuery } from "./SingleRecipeSlice";
import StarRating from "./StarRating";

export default function EditReviewForm({
  reviewId,
  onCancel,
  setIsEditingReview,
  setRecipeArr,
  setActiveReviewId,
}) {
  const [editReview, { isLoading }] = useEditReviewMutation();
  const { data: currentReview, error: fetchError } =
    useGetReviewQuery(reviewId);

  const [rev, setRev] = useState({
    review: "",
    rating: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentReview) {
      setRev({
        review: currentReview.review, // Set current review text
        rating: currentReview.rating, // Set current rating
      });
    }
  }, [currentReview]);

  // Handle changes in review input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRev((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRatingChange = (newRating) => {
    setRev((prevState) => ({
      ...prevState,
      rating: newRating,
    }));
  };

  // Handle form submission to update the review
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      review: rev.review,
      rating: rev.rating,
    };
    try {
      const { data } = await editReview({
        id: reviewId,
        body: updatedData,
      });

      if (data) {
        alert("Review updated successfully!");
        
        // Update the recipe array with the new review
        setRecipeArr((prevRecipeArr) => ({
          ...prevRecipeArr,
          review: prevRecipeArr.review.map((rev) =>
            rev.id === reviewId
              ? {
                  ...rev,
                  review: updatedData.review,
                  rating: updatedData.rating,
                }
              : rev
          ),
        }));
        onCancel();
      }
    } catch (error) {
      setError(error.message || "Error updating review");
    }
  };

  const handleCancelClick = () => {
    setIsEditingReview(false);
    setActiveReviewId(null);
  };

  if (isLoading)
    return (
      <>
        <div className="spinner-border spinner-border-sm m-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  if (fetchError) return <p>{fetchError.message || "Error fetching review"}</p>;
  return (
    <>
      <div className="edit-review">
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                <h5>Edit Review</h5>
              </label>
              <br />
              <input
                className="form-control"
                type="text"
                name="review"
                value={rev.review}
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              <label>
                <h5>Edit Rating</h5>
              </label>
              <br />
              <StarRating
                initialRating={rev.rating}
                onRatingChange={handleRatingChange}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="button-details mt-4"
            >
              {isLoading ? "Updating..." : "Update Review"}
            </button>
            &nbsp;
            <button
              type="button"
              className="button-details mt-4"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
