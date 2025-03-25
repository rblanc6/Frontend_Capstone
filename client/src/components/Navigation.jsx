import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLogin } from "../app/confirmLoginSlice";
import logo from "../logos/logo.jpg";
import { useDispatch } from "react-redux";
import { confirmLogout } from "../app/confirmLoginSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function NavBar({ token }) {
  const navigate = useNavigate();
  const auth = useSelector(getLogin);
  const dispatch = useDispatch();
  const role = window.sessionStorage.getItem("role");

  // Check to see if token is expired
  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log("Current Time:", currentTime);
      console.log("Token Expiration Time:", decodedToken.exp);
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  // Function for logout, removing token and role
  const logout = () => {
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("role");
    dispatch(confirmLogout());
    navigate("/");
  };

  useEffect(() => {
    // Retrieve the token from session storage
    const token = window.sessionStorage.getItem("token");
    // Check if the token exists and is expired
    if (token && checkTokenExpiration(token)) {
      dispatch(confirmLogout());
      // Remove the token and role from sessionStorage
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("role");
      // Log that the token expired and the user was logged out
      console.log("Token expired, user logged out.");
    }
  }, [dispatch]);

  // Function to collapse the navbar when a link is clicked
  const collapseNavbar = () => {
    const navbarCollapse = document.getElementById("navbarSupportedContent");
    if (navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show"); // Collapse the navbar
    }
  };

  return (
    <>
      <nav className="navbar fixed-top navbar-expand-md bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand mb-0 h1">
            <img
              src={logo}
              alt="RACipe Hub Logo"
              style={{ maxHeight: "85px" }}
              className="rounded"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/recipes"
                  className="nav-link"
                  onClick={collapseNavbar}
                  href="#"
                >
                  Recipes
                </Link>
              </li>
              {!auth && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/register"
                      className="nav-link"
                      onClick={collapseNavbar}
                      href="#"
                    >
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/login"
                      className="nav-link"
                      onClick={collapseNavbar}
                      href="#"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
              {auth && (
                <>
                  <li className="nav-item dropdown">
                    <Link
                      to="/account"
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Account
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          to="/new-recipe"
                          className="dropdown-item"
                          onClick={collapseNavbar}
                          href="#"
                        >
                          Share Recipe
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-recipes"
                          className="dropdown-item"
                          onClick={collapseNavbar}
                          href="#"
                        >
                          My Recipes
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/favorites"
                          className="dropdown-item"
                          onClick={collapseNavbar}
                          href="#"
                        >
                          My Favorites
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider"></hr>
                      </li>
                      <li>
                        <Link
                          to="/account"
                          className="dropdown-item"
                          onClick={collapseNavbar}
                          href="#"
                        >
                          Account Details
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/"
                          onClick={() => {
                            logout();
                            collapseNavbar();
                          }}
                          className="dropdown-item"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0 justify-content-end">
              <li className="nav-item">
                {role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="nav-link"
                    onClick={collapseNavbar}
                  >
                    <i className="bi bi-person-fill-gear"></i> Admin Dash
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
