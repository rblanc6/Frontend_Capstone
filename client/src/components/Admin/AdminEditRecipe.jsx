import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "../SingleRecipe/SingleRecipeSlice";
import {
  useGetCategoriesQuery,
  useGetIngredientUnitsQuery,
} from "../Recipes/RecipesSlice";
import { useUpdateRecipeAsAdminMutation } from "./AdminSlice";
import ImageUpload from "../SingleRecipe/ImageUpload";

export default function AdminEditRecipeForm({ onCancel, setIsEditing }) {
  const { data: category, isSuccess: categorySuccess } =
    useGetCategoriesQuery();
  const { data: unit, isSuccess: unitsSuccess } = useGetIngredientUnitsQuery();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [units, setUnits] = useState([]);
  const { id } = useParams();

  // Fetch user data and set up necessary states
  const {
    data: currentRecipe,
    error: fetchError,
    isLoading,
    refetch,
  } = useGetRecipeQuery(id);

  // Update categories and units with the state on successful data fetch
  useEffect(() => {
    if (categorySuccess) {
      setCategories(category);
    }
  }, [category, categorySuccess]);

  useEffect(() => {
    if (unitsSuccess) {
      setUnits(unit);
    }
  }, [unit, unitsSuccess]);

  // Update selected categories whenever they change
  useEffect(() => {
    console.log("Selected Categories on load:", selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const numValue = +value;
    let temp = [...selectedCategory];
    const found = temp.indexOf(numValue);
    if (found !== -1) {
      temp = [...temp.filter((element) => element !== numValue)];
    } else {
      temp.push(numValue);
    }
    setSelectedCategory(temp);
  };

  // Initialize the recipe form state with current recipe values
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: [],
    categories: [],
    photo: "",
    creatorId: "",
  });
  const [error, setError] = useState(null);

  const [updateRecipe, { isLoading: isUpdating, error: updateError }] =
    useUpdateRecipeAsAdminMutation();

  // States for removed ingredients and instructions
  const [removedIngredientIds, setRemovedIngredientIds] = useState([]);
  const [removedInstructionIds, setRemovedInstructionIds] = useState([]);

  useEffect(() => {
    if (currentRecipe && recipe.ingredients.length === 0) {
      // Filter out removed ingredients and instructions
      const filteredIngredients = currentRecipe.ingredient.filter(
        (ingredient) => !removedIngredientIds.includes(ingredient.id)
      );

      const filteredInstructions = currentRecipe.instructions.filter(
        (instruction) => !removedInstructionIds.includes(instruction.id)
      );

      // Update the form with current recipe details
      setRecipe({
        name: currentRecipe.name,
        description: currentRecipe.description,
        ingredients: filteredIngredients.map((ing) => ({
          id: ing.id,
          name: ing.ingredient.name,
          quantity: ing.quantity,
          unitName: ing.unit.name,
        })),
        instructions:
          filteredInstructions.map((inst) => ({
            id: inst.id,
            instruction: inst.instruction,
          })) || [],
        categories: currentRecipe.categories || [],
        photo: currentRecipe.photo,
        creatorId: currentRecipe.creatorId,
      });

      // Set selected categories based on current recipe
      setSelectedCategory(currentRecipe.categories?.map((cat) => cat.id) || []);
    }
  }, [currentRecipe, removedIngredientIds, removedInstructionIds]);

  // Handle input field changes (name, description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle ingredient input changes (name, quantity, unit)
  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][name] = value;
    setRecipe((prevState) => ({
      ...prevState,
      ingredients: newIngredients,
    }));
  };
  const handleAddIngredient = () => {
    setRecipe((prevState) => ({
      ...prevState,
      ingredients: [
        ...prevState.ingredients,
        { name: "", quantity: "", unitName: "" },
      ],
    }));
  };

  const handleRemoveIngredient = (index) => {
    const removedIngredient = recipe.ingredients[index];
    if (removedIngredient.id) {
      setRemovedIngredientIds((prev) => [...prev, removedIngredient.id]);
    }
    setRecipe((prevState) => {
      const newIngredients = prevState.ingredients.filter(
        (_, i) => i !== index
      );
      return {
        ...prevState,
        ingredients: newIngredients,
      };
    });
  };

  const handleInstructionChange = (index, e) => {
    const { value } = e.target;
    const newInstructions = [...recipe.instructions];
    const instructionToUpdate = newInstructions[index];

    // Ensure instructionToUpdate has an id before parsing.
    if (instructionToUpdate && instructionToUpdate.id !== undefined) {
      // Parse the id to an integer.
      instructionToUpdate.id = parseInt(instructionToUpdate.id, 10); // 10 is the radix for decimal
    }

    instructionToUpdate.instruction = value; // Update the instruction text.

    setRecipe((prevState) => ({
      ...prevState,
      instructions: newInstructions,
    }));
  };

  const handleAddInstruction = () => {
    setRecipe((prevState) => ({
      ...prevState,
      instructions: [...prevState.instructions, { instruction: "" }],
    }));
  };

  const handleRemoveInstruction = (index) => {
    const removedInstruction = recipe.instructions[index];
    if (removedInstruction.id) {
      setRemovedInstructionIds((prev) => [...prev, removedInstruction.id]);
    }
    const newInstructions = [...recipe.instructions];
    newInstructions.splice(index, 1);
    setRecipe((prevState) => ({
      ...prevState,
      instructions: newInstructions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Filter out removed ingredients and instructions
    const updatedIngredients = recipe.ingredients.filter(
      (ing) => !removedIngredientIds.includes(ing.id)
    );
    const updatedInstructions = recipe.instructions.filter(
      (inst) => !removedInstructionIds.includes(inst.id)
    );

    // Separate new and existing ingredients and instructions
    const newIngredients = updatedIngredients.filter((ing) => !ing.id);
    const existingIngredients = updatedIngredients.filter((ing) => ing.id);
    const newInstructionsArray = updatedInstructions;
    const existingInstructionsArray = [];

    // Determine removed categories
    const removedCategoryIds = currentRecipe.categories
      .filter((cat) => !selectedCategory.includes(cat.id))
      .map((cat) => cat.id);

    // Prepare data for update
    const updatedData = {
      name: recipe.name,
      description: recipe.description,
      newIngredients: newIngredients,
      existingIngredients: existingIngredients,
      newInstructions: newInstructionsArray,
      existingInstructions: existingInstructionsArray,
      categories: selectedCategory,
      creatorId: recipe.creatorId,
      removedIngredientIds: Array.from(removedIngredientIds),
      removedInstructionIds: Array.from(removedInstructionIds),
      removedCategoryIds: removedCategoryIds,
    };

    if (recipe.photo) {
      updatedData.photo = recipe.photo;
    }

    try {
      // Perform update mutation
      const { data } = await updateRecipe({
        id: id,
        updatedData: updatedData,
      });

      // On successful update, refetch and cancel editing
      if (data) {
        alert("Recipe updated successfully!");
        refetch();
        onCancel();
      }
    } catch (error) {
      setError(error.message || "Error updating recipe");
    }
  };

  const handleImageUploadSuccess = (url) => {
    setRecipe((prevData) => ({
      ...prevData,
      photo: url,
    }));
  };

  const handleAdminCancelClick = () => {
    setIsEditing(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (fetchError) return <p>{fetchError.message || "Error fetching recipe"}</p>;
  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {updateError && (
            <div className="alert alert-danger">{updateError.message}</div>
          )}
          <div>
            <label>
              <h4>Recipe Name</h4>
            </label>
            <br />
            <input
              className="form-control"
              type="text"
              name="name"
              value={recipe.name}
              onChange={handleChange}
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
              value={recipe.description}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label>
              <h4>Ingredients</h4>
            </label>
            <br />
            {recipe.ingredients.map((ingredient, index) => (
              <div
                className="input-group mb-2"
                key={ingredient.id || `ingredient-${index}`}
              >
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={ingredient.name}
                  placeholder="Ingredient Name"
                  onChange={(e) => handleIngredientChange(index, e)}
                />
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={ingredient.quantity}
                  placeholder="Quantity"
                  onChange={(e) => handleIngredientChange(index, e)}
                />
                <select
                  name="unitName"
                  className="form-select"
                  value={ingredient.unitName}
                  onChange={(e) => handleIngredientChange(index, e)}
                >
                  <option value="">Select Unit</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Remove Ingredient
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={handleAddIngredient}
            >
              Add Ingredient
            </button>
          </div>
          <div className="mt-3">
            <label>
              <h4>Instructions</h4>
            </label>
            <br />
            {recipe.instructions.map((instruction, index) => (
              <div
                className="input-group mb-2"
                key={instruction.id || `instruction-${index}`}
              >
                <textarea
                  name="instructions"
                  className="form-control"
                  value={instruction.instruction}
                  onChange={(e) => handleInstructionChange(index, e)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                >
                  Remove Instruction
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary btn-sm "
              type="button"
              onClick={handleAddInstruction}
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
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={selectedCategory.includes(category.id)}
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
              <h4>Update Photo</h4>
            </label>
            <br />
            <ImageUpload onUploadSuccess={handleImageUploadSuccess} />
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="button-details mt-4"
          >
            {isUpdating ? (
              <>
                <span
                  className="spinner-border spinner-border-sm text-light"
                  aria-hidden="true"
                ></span>{" "}
                <span role="status">Updating...</span>
              </>
            ) : (
              "Update Recipe"
            )}
          </button>
          &nbsp;
          <button
            type="button"
            className="button-details mt-4"
            onClick={handleAdminCancelClick}
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}
