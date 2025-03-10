import {
  useGetUserQuery,
  // useGetReviewsQuery,
  // useGetCommentsQuery,
} from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Account() {
  const { id } = useParams();
  const { data, isSuccess } = useGetUserQuery(id);
  const [user, setUser] = useState("");
  // const {data: review, isSuccess: reviewSuccess } = useGetReviewsQuery()
  // const [reviews, setReviews] = useState("");
  // const {data: comment, isSuccess: commentSuccess } = useGetCommentsQuery()
  // const [comments, setComments] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data]);

  // useEffect(() => {
  //   if (reviewSuccess) {
  //     setReviews(data);
  //   }
  // }, [review]);
  // console.log("REVIEWS", reviews)

  // useEffect(() => {
  //   if (commentSuccess) {
  //     setComments(data);
  //   }
  // }, [comment]);
  // console.log("COMMENTS", comments)

  console.log(data);
  console.log(data?.reviews);

  return (
    <>
      <div className="container">
        <h3>
          Welcome {user.firstName} {user.lastName}
        </h3>
        <h6>{user.email}</h6>
        <hr></hr>
        <h1 className="display-6">My Recipes</h1>
        <div>
          <div className="row g-2">
            {Array.isArray(user?.recipes) && user.recipes.length > 0 ? (
              user?.recipes?.slice(0, 3).map((rec) => (
                <div className="col-4" key={rec.id}>
                  <div className="card h-100" style={{ padding: "0" }}>
                    {rec.photo ? (
                      <img
                        src={rec.photo}
                        className="card-img-top"
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src="https://placehold.co/600x600?text=No+Photo+Available"
                        className="card-img-top"
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div className="card-body">
                      <h5 className="card-title">{rec.name}</h5>
                      <p className="card-text">{rec.description}</p>
                      <p>
                        <Link
                          to={`/recipes/${rec.id}`}
                          className="button-details"
                          style={{ textDecoration: "none" }}
                        >
                          View Recipe
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>You currently have no recipes.</p>
            )}
          </div>
        </div>
        <br />
        <p>
          {Array.isArray(user?.recipes) && user.recipes?.length > 3 ? (
            <Link
              to="/my-recipes"
              className="button-details-alt"
              style={{ textDecoration: "none" }}
            >
              View all My Recipes
            </Link>
          ) : (
            ""
          )}
        </p>
        <p>
          <Link
            to="/share-recipe"
            className="button-details-alt"
            style={{ textDecoration: "none" }}
          >
            Share a Recipe
          </Link>
          <br />
        </p>

        <hr></hr>
        <h1 className="display-6">My Favorite Recipes</h1>
        <div>
          <div className="row g-2">
            {Array.isArray(user?.favorites) && user.favorites.length > 0 ? (
              user?.favorites?.slice(0, 3).map((fav) => (
                <div className="col-md-4" key={fav.id}>
                  <div className="card h-100" style={{ padding: "0" }}>
                    {fav?.recipe?.photo ? (
                      <img
                        src={fav.recipe.photo}
                        className="card-img-top"
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src="https://placehold.co/600x600?text=No+Photo+Available"
                        className="card-img-top"
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div className="card-body">
                      <h5 className="card-title">{fav.recipe.name}</h5>
                      <p className="card-text">{fav.recipe.description}</p>
                      <Link
                        to={`/recipes/${fav.recipeId}`}
                        className="button-details"
                        style={{ textDecoration: "none" }}
                      >
                        View Recipe
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <p>You currently have no recipes.</p>
                <p>
                  <Link
                    to="/recipes"
                    className="button-details-alt"
                    style={{ textDecoration: "none" }}
                  >
                    Browse Recipes
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
        <br />
        <p>
          {Array.isArray(user?.favorites) && user.favorites.length > 3 ? (
            <Link
              to="/favorites"
              className="button-details-alt"
              style={{ textDecoration: "none" }}
            >
              View all Favorites
            </Link>
          ) : (
            ""
          )}
        </p>
        <hr />
        <h1 className="display-6">My Reviews</h1>
        <table className="table">
          <tbody>
            {Array.isArray(user?.reviews) &&
              user.reviews.length > 0 &&
              user?.reviews?.map((rev) => (
                <tr className="col-4" key={rev.id}>
                  <td>
                    <h4 className="mb-0">{rev.recipe.name} </h4>
                    <p>
                      <small>
                        by{" "}
                        <i>
                          {rev.recipe.user.firstName}{" "}
                          {rev.recipe.user.lastName[0]}
                        </i>
                      </small>
                    </p>
                    {rev.review}
                  </td>
                  <td>
                    <Link
                      to={`/recipes/${rev.recipe.id}`}
                      className="button-details"
                      style={{ textDecoration: "none" }}
                    >
                      View Recipe
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
