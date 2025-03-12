import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Favorites() {
  const { id } = useParams();
  const { data, isSuccess } = useGetUserQuery(id);
  const [user, setUser] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const indexOfLastFavorite = (currentPage + 1) * itemsPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - itemsPerPage;
  const currentFavorites = user?.favorites?.slice(
    indexOfFirstFavorite,
    indexOfLastFavorite
  );

  console.log(data);

  return (
    <>
      <div className="container">
        <h2 className="mb-4">My Favorites</h2>

        {currentFavorites?.map((fav) => {
          return (
            <div
              key={fav.id}
              className="card mb-3"
            >
              <div className="row g-0">
                <div className="col-md-4">

                {fav.recipe.photo ? (
                    <img
                      src={fav.recipe.photo}
                      className="img-fluid rounded-start"
                      alt={fav.recipe.name}
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
                      <Link className={"link-style"} to={`/recipes/${fav.recipeId}`}>
                        {fav.recipe.name}
                      </Link>
                    </h4>
                    <p className="card-text">{fav.recipe.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {Math.ceil(user?.favorites?.length) > 5 ? (<nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageChange}
                pageRangeDisplayed={5}
                pageCount={Math.ceil(user?.favorites?.length / itemsPerPage)}
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
        </nav>):("")}
      </div>
    </>
  );
}
