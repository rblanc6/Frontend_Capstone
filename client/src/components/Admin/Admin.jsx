import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserAdminMutation,
} from "./AdminSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Admin() {
  const { data, isSuccess } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserAdminMutation();
  const [userArr, setUserArr] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (isSuccess) {
      setUserArr(data);
    }
  }, [data, isSuccess]);

  
    const filterUsers = userArr.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
   

  const token = window.sessionStorage.getItem("token");
  console.log("Here is my token", token);

  const [expandUser, setExpandUser] = useState(null);

  const toggleUserDetails = (userId) => {
    if (expandUser === userId) {
      setExpandUser(null); // If the same user is clicked again, hide the dropdown
    } else {
      setExpandUser(userId);
    }
  };

  const handleClickEdit = (user) => {
    setEditUser(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateUser({ id: editUser, ...formData }).unwrap();
      setUserArr((prev) =>
        prev.map((user) =>
          user.id === editUser ? { ...user, ...formData } : user
        )
      );
      setEditUser(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {/* <p style={{ wordWrap: "break-word" }}>Token: {token}</p> */}

      <input
        type="text"
        placeholder="Search Users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <h3>User List:</h3>

      <table className="table">
        <tbody>
          {filterUsers?.map((user) => (
            <>
              <tr key={user.id}>
                <th
                  scope="row"
                  onClick={() => toggleUserDetails(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  {user.firstName} {user.lastName}
                </th>

                <td>
                  <button onClick={() => toggleUserDetails(user.id)}>
                    View Details
                  </button>
                </td>
              </tr>

              {expandUser === user.id && (
                <tr>
                  <td colSpan="4">
                    <div className="dropdown-content">
                      {editUser === user.id ? (
                        <div>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                          <input
                            type="email"
                            name="email"
                            size="30"
                            value={formData.email}
                            onChange={handleChange}
                          />

                          {/* Role Dropdown - In the form fields */}
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                          >
                            {" "}
                            {formData.role === "USER" ? (
                              <>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                              </>
                            ) : (
                              <>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                              </>
                            )}
                          </select>

                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              gap: "15px",
                            }}
                          >
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setEditUser(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>

                          {/* Role Dropdown - When viewing the user details */}
                          <p>
                            <strong>Role:</strong>{" "}
                            {editUser === user.id ? (
                              <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                              >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                            ) : (
                              <span>{user.role}</span>
                            )}
                          </p>

                          <p>
                            <strong>User ID:</strong> {user.id}
                          </p>

                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              gap: "15px",
                            }}
                          >
                            <button onClick={() => handleClickEdit(user)}>
                              Edit
                            </button>
                            <button onClick={() => deleteUser({ id: user.id })}>
                              Delete
                            </button>
                            <Link
                              to={`/admin-user-details/${user.id}`}
                              className="button-details-alt"
                              style={{ textDecoration: "none" }}
                            >
                              Content Overview
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
