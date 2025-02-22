import { useGetUserQuery } from "./AccountSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Account() {
  const { id } = useParams();
  const { data, isSuccess } = useGetUserQuery(id);

  const [user, setUser] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data]);

  console.log(data);

  return (
    <>
      <div>
        <h2>
          Welcome {user.firstName} {user.lastName}
        </h2>
        <b>Email address:</b> {user.email}
        <br />
        <b>Favorites:</b>
        <ul className="list-group list-group-flush">
          {user?.favorites?.map((fav) => {
            return (
              <li key={fav.id} className="list-group-item">
                <Link to={`/recipes/${fav.recipeId}`}>{fav.recipe.name}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
