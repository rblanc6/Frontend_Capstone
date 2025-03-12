import { useState, useEffect } from "react";
import { useGetUserDetailsQuery } from "./AdminSlice";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

export default function AdminUserDetails() {
  const { id } = useParams();
  const { data, isSuccess } = useGetUserDetailsQuery(id);
  const [userDetails, setUserDetails] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUserDetails(data);
    }
  }, [data, isSuccess]);

  console.log("Test", userDetails);

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy hh:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }

  //   const viewUserDetails = (user) => {
  //     setUserDetails(user);
  //     setFormData({
  //       recipes: user.recipes,
  //       favorites: user.favorites,
  //     });
  //   };

  return (
    <div className="container">
      <div>
        <h3>User Details</h3>
        <p>
          Name: {userDetails.firstName} {userDetails.lastName}
        </p>
        <p>Email: {userDetails.email}</p>
        <p>User Id: {userDetails.id}</p>
      </div>
      <div>
        {/* {userDetails?.recipes? && userDetails.recipes.length} */}
        <h3>User Recipe Details</h3>
        {Array.isArray(userDetails.recipes) &&
        userDetails.recipes.length > 0 ? (
          userDetails.recipes.map((recipe, index) => (
            <div key={index}>
              <p>{recipe?.name}</p>
              <img src={recipe.photo} width="200px"></img>
              <h5>
                Description: <p>{recipe?.description}</p>
              </h5>
              <p>{formatDate(recipe.createdAt)}</p>
            </div>
          ))
        ) : (
          <p>No Recipes Available</p>
        )}
      </div>
      <div>
        <h3>User Review Details</h3>
        {Array.isArray(userDetails.reviews) &&
        userDetails.reviews.length > 0 ? (
          userDetails.reviews.map((review, index) => (
            <div key={index}>
              <p>{review.review}</p>
              <p>{formatDate(review.createdAt)}</p>
            </div>
          ))
        ) : (
          <p>No Reviews Available</p>
        )}
      </div>
      <div>
        <h3>User Comment Details</h3>
        {Array.isArray(userDetails.comments) &&
        userDetails.comments.length > 0 ? (
          userDetails.comments.map((comment, index) => (
            <div key={index}>
              <p>{comment.comment}</p>
              <p>{formatDate(comment.createdAt)}</p>
            </div>
          ))
        ) : (
          <p>No Comments Available</p>
        )}
      </div>
    </div>
  );
}
