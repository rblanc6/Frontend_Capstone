import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Account() {
  const { id } = useParams();
  const { data, isSuccess, isLoading, error } = useGetUserQuery(id);
  const [user, setUser] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data]);

  console.log(data);
  console.log(data?.reviews);

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
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          {error && (
            <div className="alert alert-danger" role="alert">
              Error loading user...
            </div>
          )}
          <h3>
            Welcome {user.firstName} {user.lastName}
          </h3>
          <h6>{user.email}</h6>
          <hr />
          <ul className="nav nav-fill">
            <li className="nav-item">
              <a
                className="nav-link active link-style"
                aria-current="page"
                href="#recipes"
              >
                My Recipes
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link link-style" href="#favorites">
                My Favorites
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link link-style" href="#reviews">
                My Reviews
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link link-style" href="#comments">
                My Comments
              </a>
            </li>
          </ul>
          <hr className="mb-4" />

          <h1 className="display-6" id="recipes">
            My Recipes
          </h1>
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
                            height: "20vw",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src="https://placehold.co/600x600?text=No+Photo+Available"
                          className="card-img-top"
                          style={{
                            width: "100%",
                            height: "20vw",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div className="card-body mb-4">
                        <h5 className="card-title">{rec.name}</h5>
                        <p className="card-text">{rec.description}</p>
                      </div>
                      <div className="card-body">
                        <p
                          style={{
                            position: "absolute",
                            bottom: "0",
                            margin: "20px 0",
                          }}
                        >
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
              to="/new-recipe"
              className="button-details-alt"
              style={{ textDecoration: "none" }}
            >
              Share a Recipe
            </Link>
            <br />
          </p>

          <hr className="mb-5" />
          <h1 className="display-6" id="favorites">
            My Favorite Recipes
          </h1>
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
                            height: "20vw",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src="https://placehold.co/600x600?text=No+Photo+Available"
                          className="card-img-top"
                          style={{
                            width: "100%",
                            height: "20vw",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div className="card-body mb-4">
                        <h5 className="card-title">{fav.recipe.name}</h5>
                        <p className="card-text">{fav.recipe.description}</p>
                      </div>
                      <div className="card-body">
                        <p
                          style={{
                            position: "absolute",
                            bottom: "0",
                            margin: "20px 0",
                          }}
                        >
                          <Link
                            to={`/recipes/${fav.recipeId}`}
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
          <hr className="mb-5" />
          <h1 className="display-6" id="reviews">
            My Reviews
          </h1>
          <table className="table user-table">
            <tbody>
              {Array.isArray(user?.reviews) &&
                user.reviews.length > 0 &&
                user?.reviews?.slice(0, 3).map((rev) => (
                  <tr key={rev.id}>
                    <td>
                      <h5 className="mb-0">{rev.recipe.name} </h5>
                      <p>
                        <small>
                          by{" "}
                          <i>
                            {rev.recipe.user.firstName}{" "}
                            {rev.recipe.user.lastName[0]}
                          </i>
                        </small>
                      </p>
                      <p>{rev.review}</p>
                      <p className="date-stamp">
                        Posted on {formatDate(rev.createdAt)}
                      </p>
                    </td>
                    <td style={{ minWidth: "150px", textAlign: "right" }}>
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
          <p>
            {Array.isArray(user?.reviews) && user?.reviews.length > 3 ? (
              <Link
                to="/my-reviews"
                className="button-details-alt"
                style={{ textDecoration: "none" }}
              >
                View all Reviews
              </Link>
            ) : (
              ""
            )}
          </p>
          <hr className="mb-5" />
          <h1 className="display-6" id="comments">
            My Comments
          </h1>
          <table className="table user-table">
            <tbody>
              {Array.isArray(user?.comments) &&
                user.comments.length > 0 &&
                user?.comments?.slice(0, 3).map((com) => (
                  <tr key={com.id}>
                    <td>
                      <h4 className="mb-0">{com.name} </h4>

                      <p>{com.comment}</p>
                      <p className="date-stamp">
                        Posted on {formatDate(com.createdAt)}
                      </p>
                      <p>in response to review:</p>
                      <figure
                        style={{
                          marginLeft: "10px",
                          paddingLeft: "10px",
                          borderLeft: "solid 1px #ccc",
                        }}
                      >
                        <p>{com.review.review}</p>

                        <figcaption className="blockquote-footer">
                          {com.review.user.firstName}{" "}
                          {com.review.user.lastName[0]} on{" "}
                          {formatDate(com.review.createdAt)}
                        </figcaption>
                      </figure>
                      <p>on recipe: {com.review.recipe.name}</p>
                    </td>
                    <td style={{ minWidth: "150px", textAlign: "right" }}>
                      <Link
                        to={`/recipes/${com.review.recipe.id}`}
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
          <p>
            {Array.isArray(user?.comments) && user?.comments.length > 3 ? (
              <Link
                to="/my-comments"
                className="button-details-alt"
                style={{ textDecoration: "none" }}
              >
                View all Comments
              </Link>
            ) : (
              ""
            )}
          </p>
        </div>
      )}
    </>
  );
}
