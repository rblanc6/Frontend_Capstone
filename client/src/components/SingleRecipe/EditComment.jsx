import { useState, useEffect } from "react";
import {
  useEditCommentMutation,
  useGetCommentQuery,
} from "./SingleRecipeSlice";

export default function EditCommentForm({
  commentId,
  onCancel,
  setIsEditingComment,
  setRecipeArr,
}) {
  const [editComment, { isLoading }] = useEditCommentMutation();
  const { data: currentComment, error: fetchError } =
    useGetCommentQuery(commentId);
  const [com, setCom] = useState({
    comment: "",
  });
  const [error, setError] = useState(null);

  // Populate comment input when currentComment data is fetched
  useEffect(() => {
    if (currentComment && currentComment.comment) {
      setCom({
        comment: currentComment.comment,
      });
    }
  }, [currentComment]);

  // Handle changes in the input field and update local state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCom((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to update the comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      comment: com.comment,
    };
    try {
      const { data } = await editComment({
        id: commentId,
        body: updatedData,
      });
      if (data) {
        alert("Comment updated successfully!");
        // Update the comment in the parent state (setRecipeArr)
        setRecipeArr((prevRecipeArr) => ({
          ...prevRecipeArr,
          review: prevRecipeArr.review.map((rev) =>
            rev.comments
              ? {
                  ...rev,
                  comments: rev.comments.map((comment) =>
                    comment.id === commentId
                      ? { ...comment, comment: com.comment }
                      : comment
                  ),
                }
              : rev
          ),
        }));
        onCancel();
      }
    } catch (error) {
      setError(error.message || "Error updating comment");
    }
  };

  const handleCancelClick = () => {
    setIsEditingComment(false);
  };

  if (isLoading)
    return (
      <>
        <div className="spinner-border spinner-border-sm m-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  if (fetchError)
    return <p>{fetchError.message || "Error fetching comment"}</p>;
  return (
    <>
      <div className="edit-comment">
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                <h5>Edit Comment</h5>
              </label>
              <br />
              <textarea
                className="form-control"
                rows="5"
                name="comment"
                value={com.comment}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="button-details mt-4"
            >
              {isLoading ? "Updating..." : "Update Comment"}
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
