import { useLoginMutation } from "./LoginSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { confirmLogin } from "../../app/confirmLoginSlice";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loginUser] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Call login API with email and password
      const result = await loginUser({ email, password }).unwrap();
      if (result.error) {
        console.error(error);
        setError(error.data.message);
      } else {
        // Store token and role in sessionStorage
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("role", result.role);
        dispatch(confirmLogin({ id: result.user.id }));
        
        // Redirect based on user role
        if (result.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/account");
        }
      }
    } catch (error) {
      setError(error.data.message);
      console.error(error);
    }
  }
  return (
    <div className="container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td width="150px">
                <label>Email: </label>
              </td>
              <td>
                <input
                  className="form-control"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td width="150px">
                <label>Password: </label>
              </td>
              <td>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button className="button-details">Submit</button>
                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
