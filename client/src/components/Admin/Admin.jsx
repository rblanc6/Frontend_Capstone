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
      <p>Token: {token}</p>

      <h3>User List</h3>
      <ul>
        {userArr?.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName} - {user.email}
            <button onClick={() => updateUser(user.id)}>Update</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
