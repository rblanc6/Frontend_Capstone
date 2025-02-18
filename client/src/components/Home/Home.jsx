import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
  } from "./HomeSlice";
  import { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  
  export default function Home() {
    const { data, isSuccess } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [userArr, setUserArr] = useState();
    const logout = () => {
      window.localStorage.removeItem("token");
      // window.sessionStorage.removeItem("token");
      history.push("/");
    };
  
    useEffect(() => {
      if (isSuccess) {
        setUserArr(data);
      }
    }, [data]);
    const token = window.localStorage.getItem("token");
    // const token = window.sessionStorage.getItem("token");
    console.log("Here is my token", token);
  
    return (
      <div>
        This is my Home
        <ul className="books">
          {userArr?.map((p) => (
            <li key={p.id}>
              {p.firstName} {p.lastName} - {p.email}
              <button onClick={() => updateUser(p.id)}>Update</button>
              <button onClick={() => deleteUser(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <Link to="/login" onClick={logout}>
          Logout
        </Link>
      </div>
    );
  }