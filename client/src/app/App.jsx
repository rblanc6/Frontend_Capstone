import { useState } from "react";
import "./App.css";
import Register from "../components/Register/Register";
import { Route, Routes } from "react-router-dom";
import Login from "../components/Login/Login";
import Home from "../components/Home/Home";
import Recipes from "../components/Recipes/Recipes";
import Account from "../components/Account/Account";
import SingleRecipe from "../components/SingleRecipe/SingleRecipe";
import Favorites from "../components/Account/Favorites";
import { ProtectedRoute } from "../components/ProtectedRoutes";
import NavBar from "../components/Navigation";
import NewRecipe from "../components/Account/NewRecipe";

function App() {
  const [token, setToken] = useState(null);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/recipes" element={<Recipes />}></Route>
        <Route path="/recipes/:id" element={<SingleRecipe />}></Route>
        <Route
          path="/register"
          element={<Register token={token} setToken={setToken} />}
        ></Route>
        <Route
          path="/login"
          element={<Login token={token} setToken={setToken} />}
        ></Route>
        <Route path="/account" element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
        </Route>
        <Route path="/favorites" element={<ProtectedRoute />}>
          <Route path="/favorites" element={<Favorites />} />
        </Route>
        <Route path="/share-recipe" element={<ProtectedRoute />}>
          <Route path="/share-recipe" element={<NewRecipe />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
