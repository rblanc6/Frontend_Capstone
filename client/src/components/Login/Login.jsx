import { useLoginMutation } from "./LoginSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { confirmLogin } from "../../app/confirmLoginSlice";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);
  const [loginUser] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await loginUser({ email, password }).unwrap();
      console.log("This is the loginUser result", result);
      if (result.error) {
        console.error(error);
        setError(error);
      } else {
        dispatch(confirmLogin());
        navigate("/account");
      }
      // setSuccessMessage(result.message);
    } catch (error) {
      setError(error);
      console.error(error);
    }
  }
  return (
    <>
      <div className="container">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <table className="formtable">
            <tbody>
              <tr>
                <td width="150px">
                  <label>Email: </label>
                </td>
                <td>
                  <input
                    className="inputfield"
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
                    className="inputfield"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <button className="submitbutton">Submit</button>
                  {error && <p className="error">{error.data}</p>}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
}
