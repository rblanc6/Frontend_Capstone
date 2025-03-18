import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";

export default function MyReviews() {
  const { id } = useParams();
  const { data, isSuccess, refetch } = useGetUserQuery(id);
  const [user, setUser] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const indexOfLastReview = (currentPage + 1) * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = user?.reviews?.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

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
      <div className="container">
        <h2 className="mb-4">My Reviews</h2>

        {currentReviews?.map((rev) => {
          return (
            <div key={rev.id} className="card mb-3">
              <div className="row g-0">
                <div className="card-body">
                  <blockquote className="user-remarks">
                    <small>{rev.review}</small>
                  </blockquote>
                  <p className="date-stamp">
                    Posted on {formatDate(rev.createdAt)}
                  </p>
                  <h6 className="card-title review-title bg-light">
                    see recipe:{" "}
                    <Link
                      className={"link-style"}
                      to={`/recipes/${rev.recipeId}`}
                    >
                      {rev.recipe.name}
                    </Link>
                  </h6>
                </div>
              </div>
            </div>
          );
        })}
        {Math.ceil(user?.favorites?.length) > 5 ? (
          <nav aria-label="Page navigation example">
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
          </nav>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
