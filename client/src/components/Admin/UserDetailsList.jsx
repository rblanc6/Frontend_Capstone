import { useState, useEffect } from "react";
import { useGetUserDetailsQuery } from "./AdminSlice";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

export default function UserDetailsList({ isListView }) {
  const { id } = useParams();
  const { data, isSuccess } = useGetUserDetailsQuery(id);
  const [userDetails, setUserDetails] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUserDetails(data);
    }
  }, [data, isSuccess]);

  console.log("LIST VIEW");

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy hh:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }

  return (
    <>
      <div>
        <h1>LIST VIEW HERE</h1>
        

        <h3>User Details</h3>
        <p>
          Name: {userDetails.firstName} {userDetails.lastName}
        </p>
        <p>Email: {userDetails.email}</p>
        <p>User Id: {userDetails.id}</p>
      </div>
      
        <h3>User Recipe Details</h3>
        <table className="table table-striped">
          <tbody>
            {Array.isArray(userDetails.recipes) &&
            userDetails.recipes.length > 0 ? (
              userDetails.recipes.map((recipe, index) => (
                <tr key={index}>
                  <th scope="row">{recipe.name}</th>
                  <td>{recipe.description}</td>
                  <td><button className="button-details">View Recipe</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Recipes Available</td>
              </tr>
            )}
          </tbody>
        </table>
        
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
    </>
  );
}
