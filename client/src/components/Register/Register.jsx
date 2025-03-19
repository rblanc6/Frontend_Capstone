import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./RegisterSlice";
import { confirmLogin } from "../../app/confirmLoginSlice";
import { useDispatch } from "react-redux";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser] = useRegisterMutation();
  const [error, setError] = useState(null);

  // Updates form state when user inputs data in the form
  const change = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to register the user with the form data
      const response = await registerUser(form).unwrap();
      console.log(response);
        // Dispatch action confirming login and navigate to the account page
      dispatch(confirmLogin());
        navigate("/account");
    } catch (error) {
        console.error("error response", error);
        setError(error.data.message)
      // }
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={submit}>
        <table>
          <tbody>
            <tr>
              <td width="150px">
                <label>First Name: </label>
              </td>
              <td>
                <input
                  className="form-control"
                  type="text"
                  name="firstName"
                  required
                  onChange={change}
                />
              </td>
            </tr>
            <tr>
              <td width="150px">
                <label>Last Name: </label>
              </td>
              <td>
                <input
                  className="form-control"
                  type="text"
                  name="lastName"
                  required
                  onChange={change}
                />
              </td>
            </tr>
            <tr>
              <td width="150px">
                <label>Email Address: </label>
              </td>
              <td>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  required
                  onChange={change}
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
                  name="password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                  required
                  onChange={change}
                />
              </td>
            </tr>
            <tr>
              <td>
                <p></p>
              </td>
              <td>
                <p className="small">
                  Password must be 8 or more characters in length and contain at
                  least one number, one uppercase letter, one lowercase letter.
                </p>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button type="submit" className="button-details">
                  Submit
                </button>
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
