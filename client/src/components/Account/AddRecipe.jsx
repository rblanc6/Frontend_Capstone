import { useState, useEffect } from "react";
import {
  usePostRecipeMutation,
  useGetCategoriesQuery,
  useGetIngredientUnitsQuery,
} from "../Recipes/RecipesSlice";
import ImageUpload from "../SingleRecipe/ImageUpload";
import { useNavigate } from "react-router-dom";

export default function AddRecipe() {
  const navigate = useNavigate();
  const { data: category, isSuccess: categorySuccess } =
    useGetCategoriesQuery();
  const [postRecipe, { isLoading, error }] = usePostRecipeMutation();
  const [categories, setCategories] = useState([]);
  const { data: unit, isSuccess: unitsSuccess } = useGetIngredientUnitsQuery();
  const [units, setUnits] = useState([]);

  // When categories are fetched, update the state
  useEffect(() => {
    if (categorySuccess) {
      setCategories(category); // Update categories when data is fetched successfully
    }
  }, [category, categorySuccess]);

  const handleCategoryChange = (e) => {
    const updatedCategory = e.target.value;
    const isChecked = e.target.checked;

    setRecipeData((prevData) => {
      const updatedCategories = isChecked
        ? [...prevData.categories, updatedCategory]
        : prevData.categories.filter(
            (category) => category !== updatedCategory
          );
      return {
        ...prevData,
        categories: updatedCategories,
      };
    });
  };

  // Define state for recipe form data
  const [recipeData, setRecipeData] = useState({
    name: "",
    description: "",
    categories: [],
    ingredients: [{ name: "", quantity: "", unit: "" }],
    instructions: [""],
    photo: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Handle generic input changes (e.g., recipe name, description)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // When ingredient units are fetched, update the state
  useEffect(() => {
    if (unitsSuccess) {
      setUnits(unit); // Update units when data is fetched successfully
    }
  }, [unit, unitsSuccess]);

  // Handle ingredient changes (name, quantity, unit)
  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients[index][name] = value;

    setRecipeData((prevData) => ({
      ...prevData,
      ingredients: updatedIngredients,
    }));
  };

  // Handle instruction changes
  const handleInstructionChange = (index, e) => {
    const { value } = e.target;
    const updatedInstructions = [...recipeData.instructions];
    updatedInstructions[index] = value;
    setRecipeData((prevData) => ({
      ...prevData,
      instructions: updatedInstructions,
    }));
  };

  // Add new ingredient input fields to the form
  const addIngredient = () => {
    setRecipeData((prevData) => ({
      ...prevData,
      ingredients: [
        ...prevData.ingredients,
        { name: "", quantity: "", unit: "" },
      ],
    }));
  };

  // Remove an ingredient input field from the form
  const removeIngredient = (index) => {
    setRecipeData((prevData) => ({
      ...prevData,
      ingredients: prevData.ingredients.filter((_, i) => i !== index),
    }));
  };

  // Add new instruction input field to the form
  const addInstruction = () => {
    setRecipeData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, ""],
    }));
  };

  // Remove an instruction input field from the form
  const removeInstruction = (index) => {
    setRecipeData((prevData) => ({
      ...prevData,
      instructions: prevData.instructions.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Prepare the body for the recipe creation request
    const body = {
      name: recipeData.name,
      description: recipeData.description,
      categories: recipeData.categories,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      photo: recipeData.photo,
    };
    console.log("Sending request with body:", body);
    try {
      console.log("Sending request with body:", body);
      const result = await postRecipe(body).unwrap();
      navigate(`/recipes/${result.id}`);
      console.log("Recipe created:", result); //
    } catch (error) {
      setSuccessMessage(`Error: ${error.message || "An error occurred"}`);
      console.error("Error creating recipe:", error);
    }
  };

  // Handle image upload success, save photo URL to the recipe data
  const handleImageUploadSuccess = (url) => {
    setRecipeData((prevData) => ({
      ...prevData,
      photo: url,
    }));
  };

  return (
    <div className="container">
      <h2>Share A Recipe</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <h4>Recipe Name</h4>
          </label>
          <br />
          <input
            className="form-control"
            type="text"
            name="name"
            required
            value={recipeData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-3">
          <label>
            <h4>Description</h4>
          </label>
          <br />
          <textarea
            className="form-control"
            name="description"
            required
            value={recipeData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-3">
          <label>
            <h4>Ingredients</h4>
          </label>
          <br />

          {recipeData.ingredients.map((ingredient, index) => (
            <div className="input-group mb-2" key={index}>
              <input
                type="text"
                name="name"
                className="form-control"
                required
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, e)}
              />
              <input
                type="number"
                name="quantity"
                className="form-control"
                required
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, e)}
              />
              <select
                name="unit"
                required
                className="form-select"
                value={ingredient.unit}
                aria-label="Units"
                onChange={(e) => handleIngredientChange(index, e)}
              >
                <option value="">Select Units</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => removeIngredient(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            className="btn btn-secondary btn-sm mt-2"
            type="button"
            onClick={addIngredient}
          >
            Add Ingredient
          </button>
        </div>

        <div className="mt-3">
          <label>
            <h4>Instructions</h4>
          </label>
          <br />
          {recipeData.instructions.map((instruction, index) => (
            <div className="input-group mb-2" key={index}>
              <textarea
                className="form-control"
                required
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => removeInstruction(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn btn-secondary btn-sm mt-2"
            type="button"
            onClick={addInstruction}
          >
            Add Instruction
          </button>
        </div>

        <div className="mt-3">
          <h4>Categories</h4>

          {categories.map((category) => (
            <ul
              className="form-check form-check-inline category-list"
              key={category.id}
            >
              <li>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="category"
                  value={category.id}
                  onChange={handleCategoryChange}
                  name={category.name}
                />
                <label
                  className="form-check-label"
                  htmlFor={`category-${category.id}`}
                >
                  {category.name}
                </label>
              </li>
            </ul>
          ))}
        </div>

        <div className="mt-3">
          <label>
            <h4>Add Photo</h4>
          </label>
          <ImageUpload onUploadSuccess={handleImageUploadSuccess} />
        </div>

        <button className="button-details" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm text-light"
                aria-hidden="true"
              ></span>{" "}
              <span role="status">Loading...</span>
            </>
          ) : (
            "Submit Recipe"
          )}
        </button>
      </form>

      {successMessage && <div>{successMessage}</div>}
    </div>
  );
}
