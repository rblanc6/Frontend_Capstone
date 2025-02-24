import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetIngredientUnitsQuery,
} from "../Recipes/RecipesSlice";
import { usePostRecipeMutation } from "../Recipes/RecipesSlice";

export default function NewRecipe() {
  const { data: category, isSuccess: categorySuccess } =
    useGetCategoriesQuery();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: unit, isSuccess: unitsSuccess } = useGetIngredientUnitsQuery();
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [photo, setPhoto] = useState(null);
  // const [form, setForm] = useState();
  const [addRecipe] = usePostRecipeMutation();

  useEffect(() => {
    if (categorySuccess) {
      setCategories(category);
    }
  }, [category]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    if (unitsSuccess) {
      setUnits(unit);
    }
  }, [unit]);

  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  const handleAddIngredient = () => {
    const unitName = units.find((u) => u.id === parseInt(selectedUnit))?.name;
    if (!unitName) {
      console.error("Unit not selected or invalid.");
      return;
    }
    const newIngredient = {
      name: ingredientName,
      quantity: ingredientQuantity,
      unitName,
    };
    setIngredients((prev) => [...prev, newIngredient]);
    setIngredientName("");
    setIngredientQuantity("");
    setSelectedUnit("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("instructions", JSON.stringify([instructions]));
    formData.append("ingredient", JSON.stringify(ingredients));
    formData.append("category", JSON.stringify([selectedCategory]));
    if (photo) {
      formData.append("photo", photo);
    }
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
    try {
      await addRecipe(formData);
      if (formData) {
        console.log("Recipe added successfully", formData);
      }
    } catch (error) {
      console.error(error);
    }
    console.log(formData.entries);
  };

  return (
    <>
      <div>
        <h3>Add Recipe</h3>

        <form onSubmit={handleSubmit}>
          {/* Add Recipe Name */}
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
          {/* Add Description */}
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
          {/* Add Instructions */}
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
            {/* Ingredient Name */}
            <input
              type="text"
              id="ingredientName"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              placeholder="Ingredient Name"
            ></input>
            {/* Ingredient Quantity */}
            <input
              type="number"
              id="ingredientQuantity"
              value={ingredientQuantity}
              onChange={(e) => setIngredientQuantity(e.target.value)}
              placeholder="Quantity"
            ></input>
            {/* Ingredient Unit */}
            <select
              id="unit"
              value={selectedUnit}
              aria-label="Units"
              onChange={handleUnitChange}
            >
              <option value="">Units</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleAddIngredient}>
              Add Ingredient
            </button>
          </div>
          {/* Add Photo */}
          <div className="photo">
            <label>Photo</label>
            <input
              type="file"
              id="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
              placeholder="Upload a Photo"
            />
          </div>
          {/* Category Dropdown List */}
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
