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
  
  //   const logout = () => {

  //     window.sessionStorage.removeItem("token");
  //     history.push("/");
  //   };

  useEffect(() => {
    if (isSuccess) {
      setUserArr(data);
    }
  }, [data]);

  const token = window.sessionStorage.getItem("token");
  console.log("Here is my token", token);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p style={{wordWrap: "break-word"}}>Token: {token}</p>

      <h3>User List</h3>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
        {userArr?.map((user) => (
          <tr key={user.id}>
            <th scope="row">{user.firstName} {user.lastName}</th>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td><button onClick={() => updateUser(user.id)}>Update</button></td>
            <td><button onClick={() => deleteUser(user.id)}>Delete</button></td>
          </tr>))}
        
        </tbody>
      </table>
      {/* <ul>
        {userArr?.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName} - {user.email}
            <button onClick={() => updateUser(user.id)}>Update</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
