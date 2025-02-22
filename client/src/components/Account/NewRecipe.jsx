import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../Recipes/RecipesSlice";
import { usePostRecipeMutation } from "../Recipes/RecipesSlice";

export default function NewRecipe() {
  const { data, isSuccess } = useGetCategoriesQuery();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState();
  const [addRecipe] = usePostRecipeMutation();

  useEffect(() => {
    if (isSuccess) {
      setCategories(data);
    }
  }, [data]);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const newRecipe = await addRecipe({
        name,
        description,
        instructions,
        ingredient,
        photo,
        categories,
      }).unwrap();
      console.log("categories", categories);
    } catch (error) {
      console.error(error);
    }
  }
  console.log(data);

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
              //   value={name}
              name="name"
              placeholder="Recipe Name"
            />
            <small id="help" className="form-text text-muted">
              We will never share your email with anyone else.
            </small>
          </div>
          <div className="description">
            <label>Description</label>
            <textarea
              type="text"
              id="description"
              // value={description}
              name="description"
              placeholder="Description"
            ></textarea>
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
