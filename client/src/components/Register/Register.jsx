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
      const response = await registerUser(form).unwrap();
      console.log(response);
      dispatch(confirmLogin());
      navigate("/account");
    } catch (error) {
      if (error.data && error.data.message === "Email already in use") {
        setError("This email is already in use. Please use a different one.");
      } else {
        setError(error.data);
        console.error(error.data);
      }
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={submit}>
        <table className="formtable">
          <tbody>
            <tr>
              <td width="150px">
                <label>First Name: </label>
              </td>
              <td>
                <input
                  className="inputfield"
                  type="text"
                  name="firstName"
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
                  className="inputfield"
                  type="text"
                  name="lastName"
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
                  className="inputfield"
                  type="email"
                  name="email"
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
                  className="inputfield"
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
                <p className="passwordinfo">
                  Password must be 8 or more characters in length and contain at
                  least one number, one uppercase letter, one lowercase letter.
                </p>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button type="submit" className="submitbutton">
                  Submit
                </button>
                {error && <p className="error">{error}</p>}
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
