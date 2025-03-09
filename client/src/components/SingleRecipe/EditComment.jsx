import { useState, useEffect } from "react";
import { useEditCommentMutation, useGetCommentQuery } from "./SingleRecipeSlice";
import StarRating from "./StarRating";

export default function EditCommentForm({ commentId, onCancel, setIsEditingComment }) {
  const [editComment, { isLoading }] = useEditCommentMutation();

  const { data: currentComment, error: fetchError } = useGetCommentQuery(commentId);

  const [com, setCom] = useState({
    comment: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentComment && currentComment.comment) {
      setCom({
        comment: currentComment.comment,
      });
    }
  }, [currentComment]);

  console.log("COMMENT FROM EDIT FORM",currentComment);
  console.log("INDIVIDUAL COMMENT",commentId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCom((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      comment: com.comment,
    };

     console.log(updatedData);

    try {
      const { data } = await editComment({
        id: commentId,
        body: updatedData,
      });

      if (data) {
        alert("Comment updated successfully!");
        onCancel();
      }
    } catch (error) {
      setError(error.message || "Error updating comment");
    }
  };

  const handleCancelClick = () => {
    setIsEditingComment(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (fetchError) return <p>{fetchError.message || "Error fetching comment"}</p>;
  return (
    <><div className="edit-comment">
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <h5>Edit Comment</h5>
            </label>
            <br />
            <input
              className="form-control"
              type="text"
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
