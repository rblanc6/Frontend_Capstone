import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Account() {
  const { id } = useParams();
  const { data, isSuccess } = useGetUserQuery(id);
  const [user, setUser] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data]);

  return (
    <>
      <div>
        <h2>
          Welcome {user.firstName} {user.lastName}
        </h2>
        <table className="account-table">
          <tbody>
            <tr className="account-header">
              <td>Account Details</td>
              <td>Recipes Created</td>
            </tr>
            <tr className="account-details">
              <td>
                <b>User ID#:</b> {user.id}
                <br />
                <b>Email address:</b> {user.email}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
