import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "./AdminSlice";
import { useEffect, useState } from "react";

export default function Admin() {
  const { data, isSuccess } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [userArr, setUserArr] = useState();
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (isSuccess) {
      setUserArr(data, isSuccess);
    }
  }, [data, isSuccess]);

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
  };

  const handleSave = async () => {
    try {
      await updateUser({ id: editUser, ...formData }).unwrap();
      setEditUser(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p style={{ wordWrap: "break-word" }}>Token: {token}</p>

      <h3>User List:</h3>

      <table className="table">
        <tbody>
          {userArr?.map((user) => (
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
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "15px",
                    }}
                  >
                    <button onClick={() => handleClickEdit(user)}>Edit</button>
                    <button onClick={() => deleteUser({ id: user.id })}>
                      Delete
                    </button>
                  </div>
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
                          <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                          />
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
                          <p>
                            <strong>Role:</strong> {user.role}
                          </p>
                          <p>
                            <strong>User ID:</strong> {user.id}
                          </p>
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
