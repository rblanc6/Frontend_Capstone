import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLogin } from "../app/confirmLoginSlice";

export default function NavBar({ token }) {
  const auth2 = useSelector(getLogin);

  const logout = () => {
    window.sessionStorage.removeItem("token");
    history.push("/");
  };
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-md bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand mb-0 h1">
            RACipe Hub
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
                
              {/* <li className="nav-item">
                <Link to="/" className="nav-link active" aria-current="page">
                  Home
                </Link>
              </li> */}
              <li className="nav-item">
                <Link to="/recipes" className="nav-link" href="#">
                  Recipes
                </Link>
              </li>
              {!auth2 && (
                <>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link" href="#">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link" href="#">
                      Login
                    </Link>
                  </li>
                </>
              )}
              {auth2 && (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Account
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Share Recipe
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          My Recipes
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          My Favorites
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider"></hr>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Account Details
                        </a>
                      </li>
                      <li>
                        <Link to="/" onClick={logout} className="dropdown-item">
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
     
    </>
  );
}
