import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function MyRecipes() {
  const { id } = useParams();
  const { data, isSuccess, isLoading, error } = useGetUserQuery(id);
  const [user, setUser] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data, isSuccess]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const indexOfLastRecipe = (currentPage + 1) * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const myRecipes = user?.recipes?.slice(indexOfFirstRecipe, indexOfLastRecipe);

  console.log(data);

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
          <h2 className="mb-4">My Recipes</h2>
          {error && <p>Error loading user...</p>}

          {myRecipes?.map((recipe) => {
            return (
              <div
                key={recipe.id}
                className="card mb-3"
                // style={{ maxWidth: "540px" }}
              >
                <div className="row g-0">
                  <div className="col-md-4">
                    {recipe.photo ? (
                      <img
                        src={recipe.photo}
                        className="img-fluid rounded-start"
                        alt={recipe.name}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src="https://placehold.co/600x600?text=No+Photo+Available"
                        className="img-fluid rounded-start"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h4 className="card-title">
                        <Link
                          className={"link-style"}
                          to={`/recipes/${recipe.id}`}
                        >
                          {recipe.name}
                        </Link>
                      </h4>
                      <p className="card-text">{recipe.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {Math.ceil(user?.recipes?.length) > 5 ? (
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(user?.recipes?.length / itemsPerPage)}
                    previousLabel="< previous"
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                  />
                </li>
              </ul>
            </nav>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
}
