import { useEffect, useState } from "react";
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
import Admin from "../components/Admin/Admin";
import Footer from "../components/Footer";
import MyRecipes from "../components/Account/MyRecipes";
import ImageUpload from "../components/SingleRecipe/ImageUpload";
import AddRecipe from "../components/Account/AddRecipe";
import MyReviews from "../components/Account/MyReviews";
import MyComments from "../components/Account/MyComments";

function App() {
  const [token, setToken] = useState(null);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/recipes" element={<Recipes />}></Route>
        <Route path="/recipes/:id" element={<SingleRecipe />}></Route>
        <Route path="/image" element={<ImageUpload />}></Route>
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
        <Route path="/my-recipes" element={<ProtectedRoute />}>
          <Route path="/my-recipes" element={<MyRecipes />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/new-recipe" element={<ProtectedRoute />}>
          <Route path="/new-recipe" element={<AddRecipe />}></Route>
        </Route>
        <Route path="/my-reviews" element={<ProtectedRoute />}>
          <Route path="/my-reviews" element={<MyReviews />}></Route>
        </Route>
        <Route path="/my-comments" element={<ProtectedRoute />}>
          <Route path="/my-comments" element={<MyComments />}></Route>
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
