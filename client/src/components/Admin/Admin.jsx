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
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p style={{ wordWrap: "break-word" }}>Token: {token}</p>
      <h3>User List:</h3>
      <table className="table">
        <tbody>
          {userArr?.map((user) => (
            <tr key={user.id}>
              <th
                scope="row"
                onClick={() => toggleUserDetails(user.id)}
                style={{ cursor: "pointer" }}
              >
                {user.firstName} {user.lastName}
              </th>
              {expandUser === user.id && (
                <tr>
                  <td colSpan="">
                    <div className="dropdown-content">
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p>
                        <strong>Role:</strong> {user.role}
                      </p>
                      <p>
                        <strong>User ID:</strong> {user.id}
                      </p>
                      <div>
                        <button onClick={() => updateUser(user.id)}>
                          Update
                        </button>
                        <button onClick={() => deleteUser(user.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}