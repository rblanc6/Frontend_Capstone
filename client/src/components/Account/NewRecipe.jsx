import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../Recipes/RecipesSlice";

export default function NewRecipe() {
  const { data, isSuccess } = useGetCategoriesQuery();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState();

  useEffect(() => {
    if (isSuccess) {
      setCategories(data);
    }
  }, [data]);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  console.log(data);

  return (
    <>
      <div>
        <h3>Add Recipe</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recipeName">Recipe Name</label>
            <input
              type="text"
              id="recipeName"
              value={formData.name}
              placeholder="Recipe Name"
            />
            <small id="help" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="Description">Description</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              placeholder="Description"
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
