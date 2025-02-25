import { useState, useEffect } from "react";
import { useGetRecipesQuery } from "../Recipes/RecipesSlice";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
// import header from "../../logos/header.png";

export default function Home() {
  const { data, isSuccess, isLoading, error } = useGetRecipesQuery();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [carouselRecipes, setCarouselRecipes] = useState([]);
  const navigate = useNavigate();

  const seeRecipeDetails = (id) => navigate(`/recipes/${id}`);
  const seeAllRecipes = () => navigate(`/recipes`);

  const getRandomRecipes = (recipes, num) => {
    if (!recipes || recipes.length === 0) return [];
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  useEffect(() => {
    if (isSuccess && data?.length > 0) {
      setFeaturedRecipes(getRandomRecipes(data, 3));
      setCarouselRecipes(getRandomRecipes(data, 10));
    }
  }, [data, isSuccess]);

  return (
    <>
      <div className="container-fluid mb-4">
        <header className="text-center custom-header">
          <h2>Welcome to RACipe Hub</h2>
          {/* <img src={header} alt="Banner" className="img-fluid w-100" style={{ width: "100%", height: "300px", objectFit: "cover" }} /> */}
        </header>
      </div>

      <Carousel className="mt-3">
        {carouselRecipes.map((recipe) => (
          <Carousel.Item
            key={recipe.id}
            onClick={() => seeRecipeDetails(recipe.id)}
            style={{ cursor: "pointer" }}
          >
            <img
              className="d-block w-100"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
              src={
                recipe.photo ||
                "https://placehold.co/800x400?text=No+Photo+Available"
              }
              alt={recipe.name}
            />
            <Carousel.Caption>
              <h5>
                <button
                  onClick={() => seeRecipeDetails(recipe.id)}
                  className="btn btn-link text-white"
                >
                  {recipe.name}
                </button>
              </h5>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="container">
        <p className="text-center">
          {isLoading && "Loading recipes..."}
          {error && "Error loading recipes."}
        </p>

        <h3 className="mt-4">Featured Recipes</h3>
        <div className="row">
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="col-md-4">
              <div className="card bg-dark text-white">
                <img
                  src={
                    recipe.photo ||
                    "https://placehold.co/600x600?text=No+Photo+Available"
                  }
                  className="card-img-top"
                  alt={recipe.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <button
                    onClick={() => seeRecipeDetails(recipe.id)}
                    className="btn btn-primary"
                  >
                    View Recipe Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={seeAllRecipes} className="btn btn-secondary mt-4">
          Show All Recipes
        </button>
      </div>

      <form className="mt-4">
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
        />
        <button className="btn btn-primary mt-2">Subscribe</button>
      </form>
    </>
  );
}
