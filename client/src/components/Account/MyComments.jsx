import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";

export default function MyComments() {
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
  const indexOfLastComment = (currentPage + 1) * itemsPerPage;
  const indexOfFirstComment = indexOfLastComment - itemsPerPage;
  const currentComments = user?.comments?.slice(
    indexOfFirstComment,
    indexOfLastComment
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

  console.log(data);

  return (
    <>
      <div className="container">
        <h2 className="mb-4">My Comments</h2>

        {currentComments?.map((com) => {
          return (
            <div key={com.id} className="card mb-3">
              <div>
                <div className="card-body">
                  <blockquote className="user-remarks">
                    <small>{com.comment}</small>
                  </blockquote>
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
                    <blockquote className="blockquote">
                      <p>
                        <small>{com.review.review}</small>
                      </p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                      {com.review.user.firstName} {com.review.user.lastName[0]}{" "}
                      on {formatDate(com.review.createdAt)}
                    </figcaption>
                  </figure>

                  <h6 className="card-title review-title bg-light">
                    see recipe:{" "}
                    <Link
                      className={"link-style"}
                      to={`/recipes/${com.review.recipe.id}`}
                    >
                      {com.review.recipe.name}
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
