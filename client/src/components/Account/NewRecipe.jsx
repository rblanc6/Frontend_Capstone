import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../Recipes/RecipesSlice";
import { usePostRecipeMutation } from "../Recipes/RecipesSlice";

export default function NewRecipe() {
  const { data, isSuccess } = useGetCategoriesQuery();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [photo, setPhoto] = useState(null);
  // const [form, setForm] = useState();
  const [addRecipe] = usePostRecipeMutation();

  useEffect(() => {
    if (isSuccess) {
      setCategories(data);
    }
  }, [data]);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("instructions", instructions);
    formData.append("ingredient", ingredient);
    formData.append("category", selectedCategory);
    if (photo) {
      formData.append("photo", photo);
      try {
        await addRecipe(formData);
        console.log("Recipe added successfully", addRecipe);
      } catch (error) {
        console.error(error);
      }
    }
    console.log(data);
  };

  return (
    <>
      <div>
        <h3>Add Recipe</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Name</label>
            <input
              type="text"
              id="recipeName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Recipe Name"
            />
            <small id="help" className="form-text text-muted">
              We will never share your email with anyone else.
            </small>
          </div>
          <div className="description">
            <label>Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            ></input>
          </div>
          <div className="instructions">
            <label>Instructions</label>
            <input
              type="text"
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions"
            ></input>
          </div>
          <div className="ingredient">
            <label>Ingredients</label>
            <input
              type="text"
              id="ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Ingredients"
            ></input>
          </div>
          <div className="photo">
            <label>Photo</label>
            <input
              type="file"
              id="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              placeholder="Upload a Photo"
            />
          </div>
          <div className="dropdown">
            <select
              id="category"
              value={selectedCategory}
              aria-label="Categories"
              onChange={handleCategoryChange}
            >
              <option value="">Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
